/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import React from 'react';
import AuthSwitch from './src/navigations/AuthSwitch';
import {StatusBar} from 'react-native';
import {navigationRef} from './src/navigations/RootNavigation';
import Toast, {BaseToast} from 'react-native-toast-message';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App(): React.JSX.Element {
  const queryClient = new QueryClient();

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#ffffff',
    },
  };

  const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    default: props => (
      <BaseToast
        {...props}
        style={{borderLeftColor: '#4a4a4a', backgroundColor: '#4a4a4a'}}
        contentContainerStyle={{paddingHorizontal: 15}}
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

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer theme={navTheme} ref={navigationRef}>
          <StatusBar barStyle="dark-content" />
          <AuthSwitch />
          <Toast config={toastConfig} />
        </NavigationContainer>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default App;
