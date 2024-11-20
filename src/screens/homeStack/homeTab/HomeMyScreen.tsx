import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform, Pressable, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {isFirstLogin, saveFCMToken} from 'apis/user';
import {
  useGetIsUnread,
  useReadNotification,
} from 'apis/notification/useNotifications';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';
import MyStarCarousel from 'components/home/MyStarCarousel';
import CustomText from 'components/common/CustomText';
import ChageSvg from 'assets/images/change.svg';
import IntroModal from './components/IntroModal';
import RegisterModal from 'components/common/RegisterModal';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useGetMyCommunities} from 'apis/community/useCommunities';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {WINDOW_HEIGHT} from 'constants/dimension';
import RandomCommunityCard from './components/RandomCommunityCard';
import {useWebSocket} from 'context/useWebSocket';

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeTab'
>;

const HomeMyScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const {stompClient, activateWebSocket} = useWebSocket();

  const [isRegisiterOpen, setIsRegisterOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);

  const {data: communities} = useGetMyCommunities();
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

  useEffect(() => {
    const checkFirst = async () => {
      try {
        const isFirst = await EncryptedStorage.getItem('isFirstLogin');
        if (isFirst === undefined) {
          await EncryptedStorage.setItem('isFirstLogin', 'false');
          const data = await isFirstLogin();
          if (data) {
            setIsIntroOpen(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkFirst();
  }, []);

  useEffect(() => {
    const client = stompClient.current;

    if (!client || !client.connected) {
      activateWebSocket();
    }
  }, [activateWebSocket, stompClient]);

  return (
    <View className="flex-1">
      {communities?.length !== 0 ? (
        <Pressable
          onPress={() => {
            navigation.navigate('ChangeOrder');
          }}
          className="self-end top-3 mr-4 z-10 flex-row items-center">
          <ChageSvg width={12} height={12} />
          <CustomText
            className="text-gray-400 text-[15px] ml-[4]"
            fontWeight="700">
            순서 변경
          </CustomText>
        </Pressable>
      ) : (
        <View className="h-[18]" />
      )}
      {!communities ? (
        <SkeletonPlaceholder
          backgroundColor="#f4f4f4"
          highlightColor="#ffffff"
          speed={1500}>
          <View
            style={{
              height: WINDOW_HEIGHT * 0.65,
              marginBottom: 20,
              marginHorizontal: 25,
              marginTop: 43,
              borderRadius: 20,
            }}
          />
        </SkeletonPlaceholder>
      ) : communities.length === 0 ? (
        <RandomCommunityCard />
      ) : (
        <MyStarCarousel communities={communities} />
      )}

      {isIntroOpen && (
        <IntroModal
          setIsRegisterOpen={setIsRegisterOpen}
          setIsIntroOpen={setIsIntroOpen}
        />
      )}
      {isRegisiterOpen && (
        <RegisterModal setIsRegisterOpen={setIsRegisterOpen} />
      )}
    </View>
  );
};

export default HomeMyScreen;
