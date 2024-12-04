import React, {useEffect, useRef, useState} from 'react';
import {AppState, Linking, SafeAreaView, ScrollView, View} from 'react-native';
import CustomText from '../../components/common/CustomText';
import Switch from 'components/common/Switch';
import messaging from '@react-native-firebase/messaging';
import {deleteFCMToken, saveFCMToken} from 'apis/user';
import StackHeader from 'components/common/StackHeader';
import DeviceInfo from 'react-native-device-info';

const SetNotificationScreen = ({navigation}) => {
  const [isOn, setIsOn] = useState(true);
  const appState = useRef(AppState.currentState);

  const handleToggle = async () => {
    Linking.openSettings();
  };

  useEffect(() => {
    const checkPermission = async () => {
      const authStatus = await messaging().hasPermission();
      if (authStatus !== messaging.AuthorizationStatus.AUTHORIZED) {
        setIsOn(false);
      } else {
        setIsOn(true);
      }
    };

    checkPermission();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          const deviceId = await DeviceInfo.getUniqueId();
          const authStatus = await messaging().hasPermission();
          if (authStatus !== messaging.AuthorizationStatus.AUTHORIZED) {
            setIsOn(false);
            await deleteFCMToken({deviceId});
          } else {
            setIsOn(true);
            const token = await messaging().getToken();
            await saveFCMToken({deviceId, token});
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
      <StackHeader title="알림" type="back" />
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
