import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import SettingScreen from '../screens/settingStack/SettingScreen';
import SignOutScreen from '../screens/settingStack/SignOutScreen';

export type SettingStackParamList = {
  Setting: undefined;
  SignOut: undefined;
};

const SettingStackNavigator = () => {
  const SettingStack = createNativeStackNavigator<SettingStackParamList>();

  return (
    <SettingStack.Navigator>
      <SettingStack.Screen
        name="Setting"
        component={SettingScreen}
        options={{headerTitle: '설정'}}
      />
      <SettingStack.Screen
        name="SignOut"
        component={SignOutScreen}
        options={{headerShown: false}}
      />
    </SettingStack.Navigator>
  );
};

export default SettingStackNavigator;
