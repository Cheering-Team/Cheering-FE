import {Player} from 'apis/player/types';
import React, {useEffect, useState} from 'react';
import DailyList from '../DailyList';
import {Tabs} from 'react-native-collapsible-tab-view';
import {ListRenderItem, Pressable, RefreshControl, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PlusSvg from '../../../assets/images/plus-gray.svg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {useGetPosts} from 'apis/post/usePosts';
import {Post} from 'apis/post/types';
import FeedPost from '../FeedPost';
import FeedSkeleton from 'components/skeleton/FeedSkeleton';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';
import CustomText from 'components/common/CustomText';
import {WINDOW_HEIGHT} from 'constants/dimension';
import Avatar from 'components/common/Avatar';

interface StarFeedListProps {
  community: Player;
}

const StarFeedList = ({community}: StarFeedListProps) => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: posts,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPosts(
    community.id,
    'PLAYER_POST',
    'all',
    community.curFan !== null && community.manager !== null,
  );

  const renderFeed: ListRenderItem<Post> = ({item}) => (
    <FeedPost feed={item} type="community" />
  );

  const loadPosts = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  if (community.curFan === null) {
    return null;
  }

  if (community.manager === null) {
    return (
      <Tabs.FlatList
        data={[]}
        renderItem={() => <></>}
        ListEmptyComponent={
          <View
            className="items-center justify-center pb-4"
            style={{
              height: WINDOW_HEIGHT / 2 - insets.bottom - 45 - 40,
            }}>
            <Avatar
              uri={community.image}
              size={80}
              style={{borderWidth: 1, borderColor: 'black'}}
            />
            <CustomText className="mt-5 text-lg" fontWeight="600">
              아직 참여하지 않으셨어요
            </CustomText>
          </View>
        }
      />
    );
  }

  return (
    <>
      <Tabs.FlatList
        data={posts ? posts?.pages.flatMap(page => page.posts) : []}
        showsVerticalScrollIndicator={false}
        renderItem={renderFeed}
        ListHeaderComponent={<DailyList community={community} />}
        contentContainerStyle={{paddingBottom: 70}}
        onEndReached={community.curFan && loadPosts}
        onEndReachedThreshold={community.curFan && 1}
        ListFooterComponent={
          isFetchingNextPage && community.curFan ? (
            <FeedSkeleton type="Community" />
          ) : null
        }
        ListEmptyComponent={
          isLoading ? (
            <FeedSkeleton type="Community" />
          ) : (
            <ListEmpty type="feed" />
          )
        }
        refreshControl={
          community.curFan ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          ) : undefined
        }
      />
      {community.curFan?.type === 'MANAGER' && (
        <Pressable
          style={{
            alignItems: 'center',
            position: 'absolute',
            bottom: insets.bottom + 67,
            right: 17,
            width: 42,
            height: 42,
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 100,
            shadowColor: '#000',
            shadowOffset: {
              width: 1,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
          }}
          onPress={() => {
            navigation.navigate('PostWrite', {communityId: community.id});
          }}>
          <PlusSvg width={20} height={20} />
        </Pressable>
      )}
    </>
  );
};

export default StarFeedList;
