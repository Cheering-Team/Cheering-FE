import React from 'react';
import NotificationScreen from 'screens/homeStack/NotificaitonScreen';
import HomeTabNavigator from './HomeTabNavigator';
import CommunityStackNavigator, {
  CommunityStackParamList,
} from './CommunityStackNavigator';
import {NavigationPropType} from './types';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export type HomeStackParamList = {
  HomeTab: undefined;
  Notification: undefined;
  CommunityStack: NavigationPropType<CommunityStackParamList>;
};

const HomeStackNavigator = () => {
  const HomeStack = createNativeStackNavigator<HomeStackParamList>();

  return (
    <HomeStack.Navigator screenOptions={{animation: 'ios_from_right'}}>
      <HomeStack.Screen
        name="HomeTab"
        component={HomeTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="CommunityStack"
        component={CommunityStackNavigator}
        options={{
          headerShown: false,
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
