import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import AuthSwitch from './src/navigations/AuthSwitch';
import {StatusBar, StyleSheet, View} from 'react-native';
import {navigationRef} from './src/navigations/RootNavigation';
import Toast from 'react-native-toast-message';
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
import {DevToolsBubble} from 'react-native-react-query-devtools';
import {BlurView} from '@react-native-community/blur';
import CustomText from 'components/common/CustomText';
import CheckSvg from 'assets/images/check-white.svg';

export const toastConfig = {
  successBlur: ({text1, props}) => (
    <View
      style={{
        overflow: 'hidden',
        width: '85%',
        height: 65,
        borderRadius: 10,
      }}>
      <BlurView
        blurType="dark"
        blurAmount={3}
        style={[
          {
            alignItems: 'center',
            flexDirection: 'row',
            borderRadius: 10,
          },
        ]}>
        <View
          style={{
            padding: 3,
            backgroundColor: '#0ea5e9',
            borderRadius: 999,
            marginLeft: 20,
            marginRight: 15,
          }}>
          <CheckSvg width={13} height={13} />
        </View>
        <CustomText
          fontWeight="500"
          style={{
            color: 'white',
            fontSize: 16,
            textAlign: 'center',
            lineHeight: 65,
          }}>
          {text1}
        </CustomText>
      </BlurView>
    </View>
  ),
  success: ({text1, props}) => (
    <View
      style={{
        width: '85%',
        height: 60,
        borderRadius: 10,
        backgroundColor: 'rgba(78, 78, 78, 0.98)',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          padding: 3,
          backgroundColor: '#0ea5e9',
          borderRadius: 999,
          marginLeft: 20,
          marginRight: 15,
        }}>
        <CheckSvg width={13} height={13} />
      </View>
      <CustomText
        fontWeight="500"
        style={{
          color: 'white',
          fontSize: 16,
          textAlign: 'center',
          lineHeight: 60,
        }}>
        {text1}
      </CustomText>
    </View>
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
              <StatusBar
                barStyle="dark-content"
                translucent={true}
                backgroundColor="transparent"
              />
              <AuthSwitch />
            </NavigationContainer>
            <Toast config={toastConfig} />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
        {/* <DevToolsBubble /> */}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
