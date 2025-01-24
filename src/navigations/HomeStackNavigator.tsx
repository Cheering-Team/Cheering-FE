import React from 'react';
import NotificationScreen from 'screens/homeStack/NotificaitonScreen';
import CommunityStackNavigator, {
  CommunityStackParamList,
} from './CommunityStackNavigator';
import {NavigationPropType} from './types';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AdminStackNavigator, {AdminStackParamList} from './AdminStackNavigator';
import HomeMyScreen from 'screens/homeStack/homeTab/homeMyStack/HomeMyScreen';

export type HomeStackParamList = {
  Home: undefined;
  Notification: undefined;
  CommunityStack: NavigationPropType<CommunityStackParamList>;
  AdminStack: NavigationPropType<AdminStackParamList>;
};

const HomeStackNavigator = () => {
  const HomeStack = createNativeStackNavigator<HomeStackParamList>();

  return (
    <HomeStack.Navigator screenOptions={{animation: 'ios_from_right'}}>
      <HomeStack.Screen
        name="Home"
        component={HomeMyScreen}
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
      <HomeStack.Screen
        name="AdminStack"
        component={AdminStackNavigator}
        options={{
          headerShown: false,
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
