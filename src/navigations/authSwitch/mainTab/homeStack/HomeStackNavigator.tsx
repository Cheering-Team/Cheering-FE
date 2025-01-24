import React from 'react';
import NotificationScreen from 'screens/homeStack/NotificaitonScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from 'screens/homeStack/homeTab/homeMyStack/HomeScreen';
import CommunityStackNavigator, {
  CommunityStackParamList,
} from '../CommunityStackNavigator';
import AdminStackNavigator, {
  AdminStackParamList,
} from 'navigations/adminStack/AdminStackNavigator';
import {NavigationPropType} from 'navigations/types';
import MyCommunityEditScreen from './screens/myCommunityEdit/MyCommunityEditScreen';

export type HomeStackParamList = {
  Home: undefined;
  Notification: undefined;
  MyCommunityEdit: undefined;
  CommunityStack: NavigationPropType<CommunityStackParamList>;
  AdminStack: NavigationPropType<AdminStackParamList>;
};

const HomeStackNavigator = () => {
  const HomeStack = createNativeStackNavigator<HomeStackParamList>();

  return (
    <HomeStack.Navigator screenOptions={{animation: 'ios_from_right'}}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
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
        name="MyCommunityEdit"
        component={MyCommunityEditScreen}
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
