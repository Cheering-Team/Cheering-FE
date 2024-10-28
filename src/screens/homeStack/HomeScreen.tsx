import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  PermissionsAndroid,
  Platform,
  Pressable,
  RefreshControl,
  View,
} from 'react-native';
import HomeHeader from '../../components/home/HomeHeader';
import CustomText from '../../components/common/CustomText';
import {useGetPosts} from '../../apis/post/usePosts';
import FeedPost from '../../components/community/FeedPost';
import ListLoading from '../../components/common/ListLoading/ListLoading';
import ListEmpty from '../../components/common/ListEmpty/ListEmpty';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useScrollToTop} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {saveFCMToken} from 'apis/user';
import {
  useGetIsUnread,
  useReadNotification,
} from 'apis/notification/useNotifications';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';
import MyStarCarousel from 'components/home/MyStarCarousel';
import {queryClient} from '../../../App';
import {postKeys} from 'apis/post/queries';
import {Post} from 'apis/post/types';
import FeedSkeleton from 'components/skeleton/FeedSkeleton';
import {showBottomToast, showTopToast} from 'utils/toast';
import {useGetMyCommunities} from 'apis/player/usePlayers';
import {WINDOW_HEIGHT} from 'constants/dimension';

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'Home'
>;

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const scrollY = useSharedValue(0);
  const translateY = useSharedValue(0);

  const flatListRef = useRef<FlatList>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // const {
  //   data: posts,
  //   refetch,
  //   hasNextPage,
  //   fetchNextPage,
  //   isFetchingNextPage,
  // } = useGetPosts(0, 'FAN_POST', 'all', true);
  // const {data: communities} = useGetMyCommunities();
  // const {refetch: refetchUnRead} = useGetIsUnread();
  // const {mutateAsync: readNotificaiton} = useReadNotification();

  // useEffect(() => {
  //   if (posts) {
  //     posts.pages[posts.pages.length - 1].posts.forEach(post => {
  //       queryClient.setQueryData(postKeys.detail(post.id), post);
  //     });
  //   }
  // });

  // useScrollToTop(
  //   useRef({
  //     scrollToTop: () => {
  //       flatListRef.current?.scrollToOffset({offset: 0, animated: true});
  //       handleRefresh();
  //     },
  //   }),
  // );

  // const renderFeed: ListRenderItem<Post> = ({item}) => (
  //   <FeedPost feed={item} type="home" />
  // );

  // const loadPosts = () => {
  //   if (hasNextPage) {
  //     fetchNextPage();
  //   }
  // };

  const calcTranslateY = (curOffsetY: number, lastScrollY: number) => {
    'worklet';
    if (curOffsetY > lastScrollY) {
      if (curOffsetY < 53) {
        return translateY.value;
      }
      if (-translateY.value >= 53) {
        return -53;
      }
      return translateY.value - (curOffsetY - lastScrollY);
    }

    if (translateY.value + (lastScrollY - curOffsetY) > 0) {
      return 0;
    }

    return translateY.value + (lastScrollY - curOffsetY);
  };

  const handleScroll = useAnimatedScrollHandler(event => {
    const offsetY = event.contentOffset.y;
    const contentHeight = event.contentSize.height;
    const layoutHeight = event.layoutMeasurement.height;

    const lastScrollY = scrollY.value;

    if (offsetY <= 0) {
      scrollY.value = offsetY;
      return;
    }

    if (contentHeight / layoutHeight <= 1) {
      if (offsetY > 0) {
        scrollY.value = offsetY;
        return;
      }
    } else if (offsetY > contentHeight - layoutHeight) {
      scrollY.value = offsetY;
      return;
    }

    scrollY.value = offsetY;
    translateY.value = calcTranslateY(offsetY, lastScrollY);
    return;
  });

  // const handleRefresh = () => {
  //   setIsRefreshing(true);
  //   refetch();

  //   setTimeout(() => {
  //     setIsRefreshing(false);
  //   }, 1000);
  // };

  useEffect(() => {
    const getToken = async () => {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        await saveFCMToken({token: fcmToken});
      }
    };

    const onTokenRefreshListener = messaging().onTokenRefresh(
      async newToken => {
        await saveFCMToken({token: newToken});
      },
    );

    const requestPermission = async () => {
      if (Platform.OS === 'ios') {
        const authorizationStatus = await messaging().requestPermission();

        if (authorizationStatus) {
          getToken();
        }
      } else {
        const authorizationStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (authorizationStatus === PermissionsAndroid.RESULTS.GRANTED) {
          getToken();
        }
      }
    };

    requestPermission();

    return () => {
      onTokenRefreshListener();
    };
  }, []);

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async () => {
  //     refetchUnRead();
  //   });

  //   return unsubscribe;
  // }, []);

  // useEffect(() => {
  //   messaging().onNotificationOpenedApp(async remoteMessage => {
  //     if (remoteMessage && remoteMessage.data) {
  //       const {postId, notificationId} = remoteMessage.data;
  //       try {
  //         await readNotificaiton({notificationId: Number(notificationId)});

  //         navigation.navigate('CommunityStack', {
  //           screen: 'Post',
  //           params: {postId: Number(postId)},
  //         });
  //       } catch (error: any) {
  //         if (error.message === '존재하지 않는 알림') {
  //           navigation.navigate('Home');
  //         }
  //       }
  //     }
  //   });

  //   messaging()
  //     .getInitialNotification()
  //     .then(async remoteMessage => {
  //       if (remoteMessage && remoteMessage.data) {
  //         const {postId, notificationId} = remoteMessage.data;
  //         try {
  //           await readNotificaiton({notificationId: Number(notificationId)});

  //           navigation.navigate('CommunityStack', {
  //             screen: 'Post',
  //             params: {postId: Number(postId)},
  //           });
  //         } catch (error: any) {
  //           if (error.message === '존재하지 않는 알림') {
  //             navigation.navigate('Home');
  //           }
  //         }
  //       }
  //     });
  // }, [navigation, readNotificaiton]);

  return (
    <>
      <View className="flex-1">
        <HomeHeader translateY={translateY} />

        {/* <Animated.FlatList
          ref={flatListRef}
          className="pt-[52]"
          style={{marginTop: insets.top}}
          data={posts ? posts?.pages.flatMap(page => page.posts) : []}
          renderItem={renderFeed}
          ListHeaderComponent={
            <>
              <MyStarCarousel communities={communities} />
              {posts ? (
                <View className="flex-row items-center justify-between pl-[13] pr-[15] py-[7] bg-white border-b border-[#e7e7e7]">
                  <CustomText
                    fontWeight="500"
                    className="text-[#686868] text-[15px] pb-[2]">
                    🔥 최근 게시글
                  </CustomText>
                </View>
              ) : null}
            </>
          }
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{paddingBottom: 150}}
          onEndReached={loadPosts}
          onEndReachedThreshold={1}
          ListFooterComponent={isFetchingNextPage ? <ListLoading /> : null}
          ListEmptyComponent={
            posts ? (
              communities?.length === 0 ? (
                <View
                  className="items-center justify-center"
                  style={{
                    height: WINDOW_HEIGHT - 400 - insets.bottom - insets.top,
                  }}>
                  <CustomText
                    className="text-xl text-gray-800"
                    fontWeight="600">
                    아직 참여한 커뮤니티가 없어요
                  </CustomText>
                  <Pressable
                    className="bg-black p-2 rounded-md mt-2"
                    onPress={() => navigation.navigate('Category')}>
                    <CustomText
                      className="text-white text-[15px]"
                      fontWeight="500">
                      선수 찾아보기
                    </CustomText>
                  </Pressable>
                </View>
              ) : (
                <ListEmpty type="feed" />
              )
            ) : (
              <FeedSkeleton type="Home" />
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              progressViewOffset={53}
              colors={['#787878']}
            />
          }
        /> */}
      </View>
    </>
  );
};

export default HomeScreen;
