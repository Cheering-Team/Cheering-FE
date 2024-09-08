import React, {Dispatch, forwardRef, SetStateAction, useEffect} from 'react';
import {Animated, FlatList, View} from 'react-native';
import FeedPost from '../../community/FeedPost';
import {useInfiniteQuery} from '@tanstack/react-query';
import {getMyPlayersPosts, getPosts} from '../../../apis/post';
import HomeBanner from '../HomeBanner/HomeBanner';
import HomeTopTab from '../HomeTopTab/HomeTopTab';
import {GetPlayersResponse} from '../../../types/player';
import {Api} from '../../../types/api';
import ListLoading from '../../common/ListLoading/ListLoading';
import {useIsFocused} from '@react-navigation/native';
import CommunityEmpty from '../../common/CommunityEmpty/CommunityEmpty';
import ListEmpty from '../../common/ListEmpty/ListEmpty';
import {postKeys} from '../../../apis/post/queries';

interface HomeFlatListProps {
  playerData: Api<GetPlayersResponse[]>;
  handleScrollBeginDrag: () => void;
  handleScrollEndDrag: () => void;
  hotTab: number;
  setHotTab: Dispatch<SetStateAction<number>>;
  scrollY: Animated.Value;
}

const HomeFlatList = forwardRef<FlatList<any>, HomeFlatListProps>(
  (props, ref) => {
    const {
      playerData,
      handleScrollBeginDrag,
      handleScrollEndDrag,
      hotTab,
      setHotTab,
      scrollY,
    } = props;

    const isFocused = useIsFocused();

    const {
      data: feedData,
      isLoading,
      fetchNextPage,
      hasNextPage,
      refetch,
      isFetchingNextPage,
    } = useInfiniteQuery({
      queryKey: postKeys.list(hotTab, 'all'),
      queryFn: getPosts,
      initialPageParam: 0,
      getNextPageParam: (lastpage, pages) => {
        if (lastpage.result.last) {
          return undefined;
        }
        return pages.length;
      },
    });

    const loadFeed = () => {
      if (hasNextPage) {
        fetchNextPage();
      }
    };

    return (
      <Animated.FlatList
        ref={ref}
        data={
          isLoading ? [] : feedData?.pages.flatMap(page => page.result.posts)
        }
        renderItem={({item}) => (
          <FeedPost
            feed={item}
            playerId={hotTab}
            postId={item.id}
            hotTab={hotTab}
            type="home"
          />
        )}
        contentContainerStyle={{paddingBottom: 50}}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <HomeBanner />
            <HomeTopTab
              playerData={playerData}
              hotTab={hotTab}
              setHotTab={setHotTab}
            />
          </>
        }
        onEndReached={loadFeed}
        onEndReachedThreshold={1}
        ListFooterComponent={isFetchingNextPage ? <ListLoading /> : null}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ],
          {useNativeDriver: false},
        )}
        ItemSeparatorComponent={() => (
          <View
            style={{backgroundColor: '#F0F2F5', height: 6, width: '100%'}}
          />
        )}
        keyboardShouldPersistTaps="always"
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        ListEmptyComponent={
          !(playerData?.result.length > 0) ? (
            <CommunityEmpty />
          ) : isLoading ? (
            <ListLoading />
          ) : (
            <ListEmpty />
          )
        }
      />
    );
  },
);

export default HomeFlatList;
