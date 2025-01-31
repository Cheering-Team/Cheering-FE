import React, {useState} from 'react';
import {ActivityIndicator, Pressable, RefreshControl, View} from 'react-native';
import LogoSvg from 'assets/images/logo-text.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MyStarCarousel from 'components/home/MyStarCarousel';
import {useGetMyCommunities} from 'apis/community/useCommunities';
import CustomText from 'components/common/CustomText';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import AlertSvg from 'assets/images/alert-black.svg';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'navigations/authSwitch/mainTab/homeStack/HomeStackNavigator';
import {useGetMyHotPosts} from 'apis/post/usePosts';
import FeedPost from 'components/community/FeedPost';
import RandomCommunityCard from '../../../../../../screens/homeStack/homeTab/components/RandomCommunityCard';
import TodayMatches from './components/TodayMatches';
import RecommendMeets from './components/RecommendMeets';
import HotTeams from './components/HotTeams';
import HotPlayers from './components/HotPlayers';
import {useMainTabScroll} from 'context/useMainTabScroll';
import Animated, {
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import {queryClient} from '../../../../../../../App';
import {communityKeys} from 'apis/community/queries';
import {matchKeys} from 'apis/match/queries';
import {userKeys} from 'apis/user/queries';
import {meetKeys} from 'apis/meet/queries';
import {teamKeys} from 'apis/team/queries';

const HomeScreen = () => {
  useDarkStatusBar();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const insets = useSafeAreaInsets();
  const {scrollY: tabScrollY, previousScrollY} = useMainTabScroll();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const {data: communities} = useGetMyCommunities(true);
  const {
    data: posts,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMyHotPosts();

  const loadPosts = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = async () => {
    const today = new Date();
    setIsRefreshing(true);
    refetch();
    await Promise.all([
      queryClient.refetchQueries({
        queryKey: communityKeys.listByMy(),
      }),
      queryClient.refetchQueries({
        queryKey: matchKeys.listByDate(
          today.getFullYear(),
          today.getMonth() + 1,
          today.getDate(),
        ),
      }),
      queryClient.refetchQueries({
        queryKey: userKeys.detail(),
      }),
      queryClient.refetchQueries({
        queryKey: meetKeys.randomFive(0),
      }),
      queryClient.refetchQueries({
        queryKey: teamKeys.popularList(),
      }),
      queryClient.refetchQueries({
        queryKey: communityKeys.popularList(),
      }),
    ]);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const scrollHandler = useAnimatedScrollHandler(event => {
    const currentScrollY = event.contentOffset.y;

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

  if (!communities) {
    return null;
  }

  return (
    <View
      className="flex-1"
      style={{
        marginTop: insets.top,
      }}>
      <View className="h-[45] justify-between items-center flex-row">
        <View className="w-[50] h-[50]" />
        <LogoSvg width={200} height={50} />
        <Pressable
          className="w-[50] h-[50] justify-center items-center"
          onPress={() => {
            navigation.navigate('Notification');
          }}>
          <AlertSvg width={22} height={22} />
        </Pressable>
      </View>
      {communities.length !== 0 ? (
        <Animated.FlatList
          data={posts?.pages.flatMap(page => page.posts)}
          contentContainerStyle={{paddingBottom: insets.bottom + 60}}
          renderItem={({item}) => <FeedPost feed={item} type="community" />}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onEndReached={loadPosts}
          onEndReachedThreshold={1}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#787878']}
            />
          }
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator /> : null
          }
          ListHeaderComponent={
            <>
              <View className="flex-row-reverse justify-between items-center px-6 mt-[4] mb-[5]">
                <Pressable
                  className="border-b border-b-gray-600"
                  onPress={() => navigation.navigate('EditMyCommunity')}>
                  <CustomText className="text-gray-600 text-[13.5px]">
                    수정하기
                  </CustomText>
                </Pressable>
              </View>
              <MyStarCarousel communities={communities} />
              <TodayMatches />
              <RecommendMeets />
              <HotTeams />
              <HotPlayers />
              {posts?.pages.flatMap(page => page.posts).length !== 0 && (
                <CustomText
                  className="text-lg mt-5 mb-[10] ml-4"
                  fontWeight="500">
                  인기 게시글
                </CustomText>
              )}
            </>
          }
        />
      ) : (
        <RandomCommunityCard />
      )}
    </View>
  );
};

export default HomeScreen;
