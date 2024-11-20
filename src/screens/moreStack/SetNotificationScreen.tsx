import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  Linking,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import CustomText from '../../components/common/CustomText';
import Switch from 'components/common/Switch';
import messaging from '@react-native-firebase/messaging';
import {deleteFCMToken, saveFCMToken} from 'apis/user';
import StackHeader from 'components/common/StackHeader';

const SetNotificationScreen = ({navigation}) => {
  const [isOn, setIsOn] = useState(true);
  const appState = useRef(AppState.currentState);

  const handleToggle = async () => {
    Linking.openSettings();
  };

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'ios') {
        const authorizationStatus = await messaging().requestPermission();

        setIsOn(!!authorizationStatus);
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        setIsOn(granted === PermissionsAndroid.RESULTS.GRANTED);
      }
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
          if (Platform.OS === 'ios') {
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
          } else {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            );

            setIsOn(granted === PermissionsAndroid.RESULTS.GRANTED);

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              await deleteFCMToken();
            }
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              const fcmToken = await messaging().getToken();
              await saveFCMToken({token: fcmToken});
            }
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
