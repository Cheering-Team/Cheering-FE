import React from 'react';
import NoticeScreen from 'screens/moreStack/NoticeScreen';
import NotificationScreen from 'screens/homeStack/NotificaitonScreen';
import HomeTabNavigator from './HomeTabNavigator';
import CommunityStackNavigator, {
  CommunityStackParamList,
} from './CommunityStackNavigator';
import {NavigationPropType} from './types';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import ChangeOrderScreen from 'screens/homeStack/ChangeOrderScreen';

export type HomeStackParamList = {
  HomeTab: undefined;
  Notice: {noticeId: number};
  Notification: undefined;
  CommunityStack: NavigationPropType<CommunityStackParamList>;
  ChangeOrder: undefined;
};

const HomeStackNavigator = () => {
  const HomeStack = createStackNavigator<HomeStackParamList>();

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
        name="Notification"
        component={NotificationScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <HomeStack.Screen
        name="CommunityStack"
        component={CommunityStackNavigator}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
