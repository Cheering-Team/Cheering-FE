import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import SettingScreen from '../screens/moreStack/SettingScreen';
import SignOutScreen from '../screens/moreStack/SignOutScreen';
import MoreScreen from '../screens/moreStack/MoreScreen';
import MyProfileScreen from '../screens/moreStack/MyProfileScreen';

export type MoreStackParamList = {
  More: undefined;
  MyProfile: undefined;
  Setting: undefined;
  SignOut: undefined;
};

const MoreStackNavigator = () => {
  const MoreStack = createNativeStackNavigator<MoreStackParamList>();

  return (
    <MoreStack.Navigator>
      <MoreStack.Screen
        name="More"
        component={MoreScreen}
        options={{headerShown: false}}
      />
      <MoreStack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{headerShown: false}}
      />
      <MoreStack.Screen
        name="Setting"
        component={SettingScreen}
        options={{headerTitle: '설정'}}
      />
      <MoreStack.Screen
        name="SignOut"
        component={SignOutScreen}
        options={{headerShown: false}}
      />
    </MoreStack.Navigator>
  );
};

export default MoreStackNavigator;
