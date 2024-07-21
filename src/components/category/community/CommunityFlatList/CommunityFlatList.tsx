import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Pressable,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCommunityFlatListHook} from './hooks/useCommunityFlatListHook';
import CommunityHeader from '../CommunityHeader';
import {useInfiniteQuery} from '@tanstack/react-query';
import {getPosts} from '../../../../apis/post';
import CommunityProfile from '../CommunityProfile';
import CommunityTopTab from '../CommunityTab';
import FeedFilter from '../FeedFilter';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import FeedPost from '../FeedPost';
import NotJoin from '../NotJoin';
import CustomText from '../../../common/CustomText';

interface CommunityFlatListProps {
  playerId: number;
  playerData: any;
  setIsModalOpen: any;
  handleScrollBeginDrag: any;
  handleScrollEndDrag: any;
}

const CommunityFlatList = forwardRef((props: CommunityFlatListProps, ref) => {
  const {
    playerId,
    playerData,
    setIsModalOpen,
    handleScrollBeginDrag,
    handleScrollEndDrag,
  } = props;

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const scrollY = useRef(new Animated.Value(0)).current;

  const [selectedFilter, setSelectedFilter] = useState('all');

  const [nativeScrollY, styles, onLayoutHeaderElement, onLayoutStickyElement] =
    useCommunityFlatListHook();

  const {
    data: feedData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', playerId, selectedFilter],
    queryFn: getPosts,
    initialPageParam: 0,
    getNextPageParam: (lastpage, pages) => {
      if (lastpage.result.last) {
        return undefined;
      }
      return pages.length;
    },
    enabled: playerData.result.user !== null,
  });

  useEffect(() => {
    if (isFocused && playerData.result.user) {
      refetch();
    }
  }, [isFocused, playerData.result.user, refetch]);

  nativeScrollY.addListener(
    Animated.event([{value: scrollY}], {useNativeDriver: false}),
  );

  const loadFeed = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderFeed = ({item}) => {
    if (playerData.result.user) {
      return (
        <Pressable
          key={item.id}
          onPress={() => {
            navigation.navigate('Post', {postId: item.id});
          }}>
          <FeedPost
            feed={item}
            playerId={playerId}
            postId={item.id}
            selectedFilter={selectedFilter}
          />
        </Pressable>
      );
    } else {
      return (
        <NotJoin playerData={playerData} setIsModalOpen={setIsModalOpen} />
      );
    }
  };

  return (
    <SafeAreaView edges={['bottom']}>
      <CommunityHeader playerData={playerData} scrollY={scrollY} />
      <Animated.View
        style={styles.stickyElement}
        onLayout={onLayoutStickyElement}>
        <CommunityTopTab />
      </Animated.View>
      <Animated.FlatList
        ref={ref}
        data={
          playerData.result.user
            ? feedData?.pages.flatMap(page => page.result.posts)
            : [1]
        }
        contentContainerStyle={{paddingBottom: 30}}
        renderItem={renderFeed}
        scrollEnabled={!!playerData.result.user || feedData?.pages.length === 0}
        ListHeaderComponent={
          <Animated.View onLayout={onLayoutHeaderElement}>
            <CommunityProfile playerData={playerData} />
            {playerData.result.user && (
              <FeedFilter
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
              />
            )}
          </Animated.View>
        }
        ListHeaderComponentStyle={styles.header}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: nativeScrollY,
                },
              },
            },
          ],
          {useNativeDriver: true},
        )}
        onEndReached={playerData.result.user && loadFeed}
        onEndReachedThreshold={playerData.result.user && 0}
        ListFooterComponent={
          isLoading || (isFetchingNextPage && playerData.result.user) ? (
            <View
              style={{
                height: Dimensions.get('window').height * 0.3 + 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size={'large'} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View
              style={{
                height: Dimensions.get('window').height * 0.3 + 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <CustomText
                fontWeight="600"
                style={{fontSize: 23, marginBottom: 5}}>
                아직 게시글이 없어요
              </CustomText>
              <CustomText style={{color: '#5b5b5b'}}>
                가장 먼저 게시글을 작성해보세요
              </CustomText>
            </View>
          ) : (
            <></>
          )
        }
      />
    </SafeAreaView>
  );
});

export default CommunityFlatList;
