/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import AuthSwitch from './src/navigators/AuthSwitch';

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <AuthSwitch />
    </NavigationContainer>
  );
}

export default App;
