import React, {useEffect, useState} from 'react';
import {Platform, Pressable, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {isFirstLogin, saveFCMToken} from 'apis/user';
import {
  useGetIsUnread,
  useReadNotification,
} from 'apis/notification/useNotifications';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import MyStarCarousel from 'components/home/MyStarCarousel';
import CustomText from 'components/common/CustomText';
import ChageSvg from 'assets/images/change.svg';
import IntroModal from '../components/IntroModal';
import RegisterModal from 'components/common/RegisterModal';
import {useGetMyCommunities} from 'apis/community/useCommunities';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {WINDOW_HEIGHT} from 'constants/dimension';
import RandomCommunityCard from '../components/RandomCommunityCard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {checkNotificationPermission} from 'utils/fcmUtils';
import DeviceInfo from 'react-native-device-info';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';
import {useWebSocket} from 'context/useWebSocket';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';

const HomeMyScreen = () => {
  useDarkStatusBar();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const insets = useSafeAreaInsets();

  const [isRegisiterOpen, setIsRegisterOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);

  const {activateWebSocket, isConnected} = useWebSocket();

  const {data: communities} = useGetMyCommunities(true);
  const {refetch: refetchUnRead} = useGetIsUnread();
  const {mutateAsync: readNotificaiton} = useReadNotification();

  // 알림 firebase 관련 요청
  useEffect(() => {
    checkNotificationPermission();
    const unsubscribe = messaging().onTokenRefresh(async token => {
      const deviceId = await DeviceInfo.getUniqueId();
      await saveFCMToken({deviceId, token});
    });
    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async payload => {
      if (payload.data.type === 'POST') {
        refetchUnRead();
      }
    });
    return unsubscribe;
  }, [refetchUnRead]);
  // 백그라운드, 종료 알림 클릭 처리
  useEffect(() => {
    messaging().onNotificationOpenedApp(async remoteMessage => {
      if (remoteMessage && remoteMessage.data) {
        const {type} = remoteMessage.data;
        if (type === 'POST') {
          const {postId, notificationId} = remoteMessage.data;
          try {
            await readNotificaiton({notificationId: Number(notificationId)});

            navigation.navigate('CommunityStack', {
              screen: 'Post',
              params: {postId: Number(postId)},
            });
          } catch (error: any) {
            if (error.message === '존재하지 않는 알림') {
              navigation.navigate('HomeTab', {screen: 'MY'});
            }
          }
        }
        if (type === 'MATCH') {
          const {matchId, communityId} = remoteMessage.data;
          navigation.navigate('CommunityStack', {
            screen: 'Match',
            params: {
              matchId: Number(matchId),
              communityId: Number(communityId),
            },
          });
        }
        if (type === 'MATCH_END_POST') {
          const {postId} = remoteMessage.data;
          navigation.navigate('CommunityStack', {
            screen: 'Post',
            params: {postId: Number(postId)},
          });
        }
        if (type === 'MATCH_END_COMMUNITY') {
          const {communityId} = remoteMessage.data;
          navigation.navigate('CommunityStack', {
            screen: 'Community',
            params: {communityId: Number(communityId)},
          });
        }
      }
    });

    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage && remoteMessage.data) {
          const {type} = remoteMessage.data;
          if (type === 'POST') {
            const {postId, notificationId} = remoteMessage.data;
            try {
              await readNotificaiton({notificationId: Number(notificationId)});

              navigation.navigate('CommunityStack', {
                screen: 'Post',
                params: {postId: Number(postId)},
              });
            } catch (error: any) {
              if (error.message === '존재하지 않는 알림') {
                navigation.navigate('HomeTab', {screen: 'MY'});
              }
            }
          }
          if (type === 'MATCH') {
            const {matchId, communityId} = remoteMessage.data;
            navigation.navigate('CommunityStack', {
              screen: 'Match',
              params: {
                matchId: Number(matchId),
                communityId: Number(communityId),
              },
            });
          }
        }
      });
  }, [navigation, readNotificaiton]);
  // 최초 로그인 확인
  useEffect(() => {
    const checkFirst = async () => {
      try {
        const data = await isFirstLogin();
        if (data) {
          setIsIntroOpen(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkFirst();
  }, [navigation]);
  useEffect(() => {
    if (!isConnected && Platform.OS === 'android') {
      activateWebSocket();
    }
  }, [activateWebSocket, isConnected]);

  return (
    <View className="flex-1">
      {communities?.length !== 0 ? (
        <Pressable
          onPress={() => {
            navigation.navigate('HomeTab', {
              screen: 'MY',
              params: {screen: 'ChangeOrder'},
            });
          }}
          className="flex-row items-center h-[20] z-10 self-end absolute right-6"
          style={{
            top:
              (WINDOW_HEIGHT - 50 - insets.top - insets.bottom - 45) * 0.0325 -
              13,
          }}>
          <ChageSvg width={12} height={12} />
          <CustomText
            className="text-gray-400 text-[13px] ml-[4]"
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
              height:
                (WINDOW_HEIGHT - 50 - insets.top - insets.bottom - 45) * 0.87,
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
