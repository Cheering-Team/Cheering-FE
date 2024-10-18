import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  PermissionsAndroid,
  Platform,
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
import {useGetMyCommunities} from 'apis/player/usePlayers';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useGetNotices} from 'apis/notice/useNotices';
import {queryClient} from '../../../App';
import {postKeys} from 'apis/post/queries';

type HomeScreenNavigationProp = NativeStackNavigationProp<
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

  const {data: communityData} = useGetMyCommunities();
  const {data: noticeData} = useGetNotices();
  const {data, refetch, hasNextPage, fetchNextPage, isFetchingNextPage} =
    useGetPosts(0, 'all', true);
  const {refetch: refetchUnRead} = useGetIsUnread();
  const {mutate} = useReadNotification();

  useEffect(() => {
    if (data) {
      data.pages[data.pages.length - 1].result.posts.forEach(post => {
        queryClient.setQueryData(postKeys.detail(post.id), post);
      });
    }
  });

  useScrollToTop(
    useRef({
      scrollToTop: () => {
        flatListRef.current?.scrollToOffset({offset: 0, animated: true});
        handleRefresh();
      },
    }),
  );

  const renderFeed: ListRenderItem<PostInfoResponse> = ({item}) => (
    <FeedPost feed={item} type="home" />
  );

  const loadFeed = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

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

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async () => {
      refetchUnRead();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage && remoteMessage.data) {
        const {postId, notificationId} = remoteMessage.data;

        navigation.navigate('HomeStack', {
          screen: 'CommunityStack',
          params: {
            screen: 'Post',
            params: {postId},
          },
        });
        mutate({notificationId: Number(notificationId)});
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage && remoteMessage.data) {
          const {postId, notificationId} = remoteMessage.data;

          navigation.navigate('HomeStack', {
            screen: 'CommunityStack',
            params: {
              screen: 'Post',
              params: {postId},
            },
          });
          mutate({notificationId: Number(notificationId)});
        }
      });
  }, [navigation]);

  return (
    <>
      <View className="flex-1">
        <HomeHeader translateY={translateY} />
        <Animated.FlatList
          ref={flatListRef}
          className="pt-[52]"
          style={{marginTop: insets.top}}
          data={data ? data?.pages.flatMap(page => page.result.posts) : []}
          // data={[]}
          renderItem={renderFeed}
          ListHeaderComponent={
            <>
              {communityData && noticeData ? (
                <MyStarCarousel
                  communityData={communityData}
                  noticeData={noticeData}
                />
              ) : (
                <SkeletonPlaceholder
                  backgroundColor="#f4f4f4"
                  highlightColor="#ffffff">
                  <View
                    style={{
                      height: 195,
                      marginBottom: 20,
                      marginHorizontal: 25,
                      marginTop: 15,
                      borderRadius: 20,
                    }}
                  />
                </SkeletonPlaceholder>
              )}
              {data ? (
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
          onEndReached={loadFeed}
          onEndReachedThreshold={1}
          ListFooterComponent={isFetchingNextPage ? <ListLoading /> : null}
          ListEmptyComponent={
            data ? (
              <ListEmpty type="feed" />
            ) : (
              <SkeletonPlaceholder
                backgroundColor="#f4f4f4"
                highlightColor="#ffffff">
                <View style={{marginTop: 50}}>
                  {[1, 1, 1, 1, 1].map(_ => (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginHorizontal: 10,
                        marginVertical: 10,
                      }}>
                      <View
                        style={{
                          width: 33,
                          height: 33,
                          borderRadius: 999,
                          marginRight: 15,
                        }}
                      />
                      <View style={{width: '100%'}}>
                        <View
                          style={{
                            width: '30%',
                            height: 14,
                            marginVertical: 4,
                            borderRadius: 3,
                          }}
                        />
                        <View
                          style={{
                            width: '70%',
                            height: 14,
                            marginVertical: 4,
                            borderRadius: 5,
                          }}
                        />
                        <View
                          style={{
                            width: '50%',
                            height: 14,
                            marginVertical: 4,
                            borderRadius: 4,
                          }}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </SkeletonPlaceholder>
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
        />
      </View>
    </>
  );
};

export default HomeScreen;
