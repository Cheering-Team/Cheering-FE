import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import CustomText from '../../components/common/CustomText';
import BackSvg from '../../../assets/images/chevron-left.svg';
import Switch from 'components/common/Switch';
import messaging from '@react-native-firebase/messaging';
import {deleteFCMToken, saveFCMToken} from 'apis/user';

const SetNotificationScreen = ({navigation}) => {
  const [isOn, setIsOn] = useState(true);
  const appState = useRef(AppState.currentState);

  const handleToggle = async () => {
    Linking.openSettings();
  };

  useEffect(() => {
    const requestPermission = async () => {
      const authorizationStatus = await messaging().requestPermission();

      setIsOn(!!authorizationStatus);
    };

    requestPermission();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          const authorizationStatus = await messaging().requestPermission();

          setIsOn(!!authorizationStatus);

          if (authorizationStatus === messaging.AuthorizationStatus.DENIED) {
            await deleteFCMToken();
          }
          if (
            authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED
          ) {
            const fcmToken = await messaging().getToken();
            await saveFCMToken({token: fcmToken});
          }
        }
        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="h-[48] px-[5] flex-row justify-between items-center bg-white border-b border-b-[#eeeeee]">
        <Pressable onPress={() => navigation.goBack()}>
          <BackSvg width={32} height={32} />
        </Pressable>

        <CustomText fontWeight="500" className="text-lg pb-0">
          알림
        </CustomText>
        <View className="w-8 h-8" />
      </View>
      <ScrollView className="flex-1">
        <View className="flex-row justify-between items-center py-[14] px-4">
          <CustomText fontWeight="400" className="text-base pb-[1]">
            푸시 알림
          </CustomText>
          <Switch isOn={isOn} onToggle={handleToggle} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SetNotificationScreen;
