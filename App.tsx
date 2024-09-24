import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import AuthSwitch from './src/navigations/AuthSwitch';
import {StatusBar} from 'react-native';
import {navigationRef} from './src/navigations/RootNavigation';
import Toast, {BaseToast} from 'react-native-toast-message';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import NaverLogin from '@react-native-seoul/naver-login';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import './gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import EncryptedStorage from 'react-native-encrypted-storage';
import {deleteFCMToken, saveFCMToken} from 'apis/user';

export const toastConfig = {
  default: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#2d2d2d',
        backgroundColor: '#2d2d2d',
      }}
      contentContainerStyle={{paddingHorizontal: 10}}
      text1Style={{
        fontWeight: 'normal',
        fontFamily: 'NotoSansKR-Medium',
        fontSize: 15,
        color: 'white',
      }}
      text2Style={{
        fontWeight: 'normal',
        fontFamily: 'NotoSansKR-Medium',
        fontSize: 15,
        color: 'white',
      }}
    />
  ),
};

const consumerKey = 'T40q4ZLAbDGZCa5v50tK';
const consumerSecret = 'Tk2ggobTof';
const appName = '치어링';
const serviceUrlScheme = 'org.reactjs.native.example.Cheering';

export const queryClient = new QueryClient();

function App(): React.JSX.Element {
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#ffffff',
    },
  };

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  });

  useEffect(() => {
    NaverLogin.initialize({
      appName,
      consumerKey,
      consumerSecret,
      serviceUrlSchemeIOS: serviceUrlScheme,
      disableNaverAppAuthIOS: true,
    });
  }, []);

  useEffect(() => {
    const checkPermission = async () => {
      const accessToken = await EncryptedStorage.getItem('accessToken');

      if (accessToken) {
        const authorizationStatus = await messaging().requestPermission();

        if (authorizationStatus === messaging.AuthorizationStatus.DENIED) {
          await deleteFCMToken();
        }
        if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
          const fcmToken = await messaging().getToken();
          await saveFCMToken({token: fcmToken});
        }
      }
    };

    checkPermission();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{flex: 1}}>
          <BottomSheetModalProvider>
            <NavigationContainer theme={navTheme} ref={navigationRef}>
              <StatusBar barStyle="dark-content" />
              <AuthSwitch />
            </NavigationContainer>
            <Toast config={toastConfig} />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
