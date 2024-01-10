/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import React from 'react';
import AuthSwitch from './src/navigators/AuthSwitch';

function App(): React.JSX.Element {
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white',
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <AuthSwitch />
    </NavigationContainer>
  );
}

export default App;
