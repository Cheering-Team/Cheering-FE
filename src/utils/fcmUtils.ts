import messaging from '@react-native-firebase/messaging';
import {saveFCMToken} from 'apis/user';
import {PermissionsAndroid, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const deviceId = await DeviceInfo.getUniqueId();
    const token = await messaging().getToken();
    await saveFCMToken({deviceId, token});
  }
};

const requestAndroidNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const deviceId = await DeviceInfo.getUniqueId();
      const token = await messaging().getToken();
      await saveFCMToken({deviceId, token});
    }
  }
};

const requestPermission = async () => {
  if (Platform.OS === 'ios') {
    await requestNotificationPermission();
  } else if (Platform.OS === 'android') {
    await requestAndroidNotificationPermission();
  }
};

export const checkNotificationPermission = async () => {
  const authStatus = await messaging().hasPermission();

  if (authStatus !== messaging.AuthorizationStatus.AUTHORIZED) {
    await requestPermission();
  } else {
    const deviceId = await DeviceInfo.getUniqueId();
    const token = await messaging().getToken();
    await saveFCMToken({deviceId, token});
  }
};
