import React, {useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
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
import IntroModal from './components/IntroModal';
import RegisterModal from 'components/common/RegisterModal';
import {useGetMyCommunities} from 'apis/community/useCommunities';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {WINDOW_HEIGHT} from 'constants/dimension';
import RandomCommunityCard from './components/RandomCommunityCard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {checkNotificationPermission} from 'utils/fcmUtils';
import DeviceInfo from 'react-native-device-info';
import {HomeMyStackParamList} from 'navigations/HomeMyStackNavigator';

const HomeMyScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeMyStackParamList>>();
  const insets = useSafeAreaInsets();

  const [isRegisiterOpen, setIsRegisterOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);

  const {data: communities} = useGetMyCommunities();
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
    const unsubscribe = messaging().onMessage(async () => {
      refetchUnRead();
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
              navigation.navigate('HomeTab');
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
                navigation.navigate('HomeTab');
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
        if (data.isFirstLogin) {
          setIsIntroOpen(true);
        }
        if (data.role === 'ADMIN') {
          navigation.navigate('Admin');
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkFirst();
  }, [navigation]);

  return (
    <View className="flex-1">
      {communities?.length !== 0 ? (
        <Pressable
          onPress={() => {
            navigation.navigate('ChangeOrder');
          }}
          className="flex-row items-center h-[20] z-10 self-end absolute right-6"
          style={{
            top:
              (WINDOW_HEIGHT - 50 - insets.top - insets.bottom - 45) * 0.0325 -
              13,
          }}>
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
