import {Community} from 'apis/community/types';
import {WINDOW_HEIGHT} from 'constants/dimension';
import React, {MutableRefObject, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MatchList from './components/MatchList';
import {useMainTabScroll} from 'context/useMainTabScroll';
import OfficialChat from './components/OfficialChat';
import HotPosts from './components/HotPosts';
import HotVote from './components/HotVote';
import {useGetNearMatch} from 'apis/match/useMatches';
import {useGetOfficialChatRoom} from 'apis/chat/useChats';
import {useGetHotVote} from 'apis/vote/useVotes';
import {useGetPosts} from 'apis/post/usePosts';
import {useFindRandomFiveMeetsByCondition} from 'apis/meet/useMeets';
import RandomMeets from './components/RandomMeets';

interface MainListProps {
  scrollY: SharedValue<number>;
  isTabFocused: boolean;
  onMomentumScrollBegin: () => void;
  onMomentumScrollEnd: () => void;
  onScrollEndDrag: () => void;
  listArrRef: MutableRefObject<
    {
      key: string;
      value: FlatList<any> | ScrollView | null;
    }[]
  >;
  tabRoute: {
    key: string;
    title: string;
  };
  community: Community;
  onTabPress: (index: number) => void;
}

const MainTab = ({
  scrollY,
  isTabFocused,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  onScrollEndDrag,
  listArrRef,
  tabRoute,
  community,
  onTabPress,
}: MainListProps) => {
  const {scrollY: tabScrollY, previousScrollY} = useMainTabScroll();
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 110 + insets.top;

  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: matches,
    isLoading: matchesIsLoading,
    refetch: matchesRefetch,
  } = useGetNearMatch(community.id);
  const {
    data: officialChatRoom,
    isLoading: officialChatRoomIsLoading,
    refetch: officialChatRoomRefetch,
  } = useGetOfficialChatRoom(community.id, true);
  const {
    data: vote,
    isLoading: voteIsLoading,
    refetch: voteRefetch,
  } = useGetHotVote(community.id, community.curFan !== null);
  const {
    data: posts,
    isLoading: postsIsLoading,
    refetch: postRefetch,
  } = useGetPosts(community.id, 'hot', community.curFan !== null);
  const {
    data: randomMeets,
    isLoading: randomMeetsIsLoading,
    refetch: randomMeetsRefetch,
  } = useFindRandomFiveMeetsByCondition(
    community.id,
    community.curFan !== null,
  );

  const scrollHandler = useAnimatedScrollHandler(event => {
    const currentScrollY = event.contentOffset.y;
    if (isTabFocused) {
      scrollY.value = currentScrollY;
    }

    if (currentScrollY > previousScrollY.value + 2 && currentScrollY > 0) {
      tabScrollY.value = withTiming(50);
    } else if (
      currentScrollY < previousScrollY.value - 2 &&
      currentScrollY > 0
    ) {
      tabScrollY.value = withTiming(0);
    }
    previousScrollY.value = currentScrollY;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    matchesRefetch();
    officialChatRoomRefetch();
    voteRefetch();
    postRefetch();
    randomMeetsRefetch();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  if (
    matchesIsLoading ||
    officialChatRoomIsLoading ||
    voteIsLoading ||
    postsIsLoading ||
    randomMeetsIsLoading
  ) {
    return (
      <View
        className="w-full justify-center items-center"
        style={{
          height: WINDOW_HEIGHT - insets.bottom - 38 - 45,
        }}>
        <ActivityIndicator color={'#828282'} size={'small'} />
      </View>
    );
  }

  return (
    <>
      <Animated.ScrollView
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
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        scrollIndicatorInsets={{
          top: 110 + insets.top,
        }}
        onScroll={scrollHandler}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollEndDrag={onScrollEndDrag}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT,
          minHeight: WINDOW_HEIGHT + HEADER_HEIGHT - 40,
          paddingBottom: insets.bottom + 200,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            progressViewOffset={HEADER_HEIGHT}
            colors={['#787878']}
          />
        }>
        {/* 일정 */}
        <MatchList
          community={community}
          onTabPress={onTabPress}
          matches={matches}
        />
        {/* 대표 채팅방 */}
        <OfficialChat officialChatRoom={officialChatRoom} />
        {/* 인기 투표 */}
        <HotVote community={community} vote={vote} />
        {/* 추천 모임 */}
        {randomMeets && community.curFan && (
          <RandomMeets
            meets={randomMeets}
            curUser={community.curFan}
            community={community}
            onTabPress={onTabPress}
          />
        )}
        {/* 인기 게시글 */}
        <HotPosts onTabPress={onTabPress} posts={posts} />
      </Animated.ScrollView>
    </>
  );
};

export default MainTab;
