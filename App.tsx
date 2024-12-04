import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import AuthSwitch from './src/navigations/AuthSwitch';
import {StatusBar} from 'react-native';
import {navigationRef} from './src/navigations/RootNavigation';
import Toast, {ToastConfigParams} from 'react-native-toast-message';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import NaverLogin from '@react-native-seoul/naver-login';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import './gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import {DevToolsBubble} from 'react-native-react-query-devtools';
import SuccessToast from 'components/common/toast/SuccessToast';
import FailToast from 'components/common/toast/FailToast';
import {WebSocketProvider} from 'context/useWebSocket';
import * as Sentry from '@sentry/react-native';
import config from 'react-native-config';
import codePush from 'react-native-code-push';

if (config.ENV === 'production') {
  Sentry.init({
    dsn: 'https://86c8cfe00233ff2bd6a83f0d10a29a77@o4508335068807168.ingest.us.sentry.io/4508335071428608',
    tracesSampleRate: 0.2,
    profilesSampleRate: 0.2,
    environment: `${config.ENV}`,
  });
}

export const toastConfig = {
  success: (params: ToastConfigParams<any>) => <SuccessToast {...params} />,
  fail: (params: ToastConfigParams<any>) => <FailToast {...params} />,
};

const consumerKey = 'T40q4ZLAbDGZCa5v50tK';
const consumerSecret = 'Tk2ggobTof';
const appName = '치어링';
const serviceUrlScheme = 'org.reactjs.native.example.Cheering';

export const queryClient = new QueryClient();
const codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME};

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

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{flex: 1}}>
          <BottomSheetModalProvider>
            <WebSocketProvider>
              <NavigationContainer theme={navTheme} ref={navigationRef}>
                <StatusBar
                  barStyle="dark-content"
                  translucent={true}
                  backgroundColor="transparent"
                />
                <AuthSwitch />
              </NavigationContainer>
            </WebSocketProvider>
            <Toast config={toastConfig} />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
        {/* <DevToolsBubble /> */}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default codePush(codePushOptions)(App);
