import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/homeStack/homeTab/HomeMyScreen';
import CommunityStackNavigator, {
  CommunityStackParamList,
} from './CommunityStackNavigator';
import NoticeScreen from 'screens/moreStack/NoticeScreen';
import {NavigationPropType} from './types';
import NotificationScreen from 'screens/homeStack/NotificaitonScreen';
import HomeTabNavigator from './HomeTabNavigator';
import HomeMyScreen from '../screens/homeStack/homeTab/HomeMyScreen';

export type HomeStackParamList = {
  HomeTab: undefined;
  CommunityStack: NavigationPropType<CommunityStackParamList>;
  Notice: {noticeId: number};
  Notification: undefined;
};

const HomeStackNavigator = () => {
  const HomeStack = createNativeStackNavigator<HomeStackParamList>();

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeTab"
        component={HomeTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="CommunityStack"
        component={CommunityStackNavigator}
        options={{headerShown: false, animation: 'simple_push'}}
      />
      <HomeStack.Screen
        name="Notice"
        component={NoticeScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
