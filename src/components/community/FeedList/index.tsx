import {WINDOW_HEIGHT} from 'constants/dimension';
import React, {MutableRefObject, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  View,
} from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useFeedList} from './useFeedList';
import {Community} from 'apis/community/types';
import FeedPost from '../FeedPost';
import {Post} from 'apis/post/types';
import FeedFilter from '../FeedFilter';
import PenSvg from 'assets/images/pencil-white.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import FeedSkeleton from 'components/skeleton/FeedSkeleton';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';

const HEADER_HEIGHT = WINDOW_HEIGHT / 2;

interface FeedListProps {
  scrollY: SharedValue<number>;
  isTabFocused: boolean;
  onMomentumScrollBegin: () => void;
  onMomentumScrollEnd: () => void;
  onScrollEndDrag: () => void;
  listArrRef: MutableRefObject<
    {
      key: string;
      value: FlatList<Post> | null;
    }[]
  >;
  tabRoute: {
    key: string;
    title: string;
  };
  community: Community;
}

const FeedList = ({
  scrollY,
  isTabFocused,
  onMomentumScrollBegin,
  listArrRef,
  tabRoute,
  onMomentumScrollEnd,
  onScrollEndDrag,
  community,
}: FeedListProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const buttonOpacity = useSharedValue(1);

  const {
    selectedFilter,
    setSelectedFilter,
    posts,
    isLoading,
    refetch,
    isFetchingNextPage,
    loadPosts,
  } = useFeedList(community);

  const renderItem: ListRenderItem<Post> = ({item}) => (
    <FeedPost feed={item} type="community" />
  );

  const scrollHandler = useAnimatedScrollHandler(event => {
    if (isTabFocused) {
      scrollY.value = event.contentOffset.y;
    }
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <View style={{flex: 1}}>
      <Animated.FlatList
        ref={ref => {
          const foundIndex = listArrRef.current.findIndex(
            e => e.key === tabRoute.key,
          );

          if (foundIndex === -1) {
            listArrRef.current.push({
              key: tabRoute.key,
              value: ref,
            });
          } else {
            listArrRef.current[foundIndex] = {
              key: tabRoute.key,
              value: ref,
            };
          }
        }}
        data={posts?.pages.flatMap(page => page.posts) || []}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT,
          minHeight: WINDOW_HEIGHT + HEADER_HEIGHT - 45,
          paddingBottom: insets.bottom + 100,
        }}
        ListHeaderComponent={
          <FeedFilter
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        }
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onMomentumScrollBegin={() => {
          buttonOpacity.value = withTiming(0.2, {duration: 150});
          onMomentumScrollBegin();
        }}
        onMomentumScrollEnd={() => {
          buttonOpacity.value = withTiming(1, {duration: 300});
          onMomentumScrollEnd();
        }}
        onScrollEndDrag={onScrollEndDrag}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            progressViewOffset={-20}
            colors={['#787878']}
          />
        }
        onEndReached={community.curFan && loadPosts}
        onEndReachedThreshold={community.curFan && 1}
        ListEmptyComponent={
          isLoading ? (
            <FeedSkeleton type="Community" />
          ) : (
            <ListEmpty type="feed" />
          )
        }
        ListFooterComponent={
          isFetchingNextPage && community.curFan ? <ActivityIndicator /> : null
        }
      />
      <Animated.View style={{opacity: buttonOpacity}}>
        <Pressable
          onPress={() => navigation.navigate('PostWrite', {community})}
          className="absolute p-[11] rounded-full z-50"
          style={{
            backgroundColor: community.color,
            bottom: insets.bottom + 57,
            right: 12,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.3,
            shadowRadius: 2,
          }}>
          <PenSvg width={23} height={23} />
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default FeedList;
