import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {saveFCMToken} from 'apis/user';
import {
  useGetIsUnread,
  useReadNotification,
} from 'apis/notification/useNotifications';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';
import {useGetMyCommunities} from 'apis/community/useCommunities';
import MyStarCarousel from 'components/home/MyStarCarousel';

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeTab'
>;

const HomeMyScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const {data: communities} = useGetMyCommunities();

  const [curTab, setCurTab] = useState<'MY' | 'HOT'>('MY');

  const {refetch: refetchUnRead} = useGetIsUnread();
  const {mutateAsync: readNotificaiton} = useReadNotification();

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
    messaging().onNotificationOpenedApp(async remoteMessage => {
      if (remoteMessage && remoteMessage.data) {
        const {postId, notificationId} = remoteMessage.data;
        try {
          await readNotificaiton({notificationId: Number(notificationId)});

          navigation.navigate('CommunityStack', {
            screen: 'Post',
            params: {postId: Number(postId)},
          });
        } catch (error: any) {
          if (error.message === '존재하지 않는 알림') {
            navigation.navigate('HomeTab');
          }
        }
      }
    });

    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage && remoteMessage.data) {
          const {postId, notificationId} = remoteMessage.data;
          try {
            await readNotificaiton({notificationId: Number(notificationId)});

            navigation.navigate('CommunityStack', {
              screen: 'Post',
              params: {postId: Number(postId)},
            });
          } catch (error: any) {
            if (error.message === '존재하지 않는 알림') {
              navigation.navigate('HomeTab');
            }
          }
        }
      });
  }, [navigation, readNotificaiton]);

  return (
    <View className="flex-1">
      <MyStarCarousel />
    </View>
  );
};

export default HomeMyScreen;
