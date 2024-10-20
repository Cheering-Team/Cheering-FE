import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/homeStack/HomeScreen';
import CommunityStackNavigator, {
  CommunityStackParamList,
} from './CommunityStackNavigator';
import NoticeScreen from 'screens/moreStack/NoticeScreen';
import {NavigationPropType} from './types';

export type HomeStackParamList = {
  Home: undefined;
  CommunityStack: NavigationPropType<CommunityStackParamList>;
  Notice: {noticeId: number};
};

const HomeStackNavigator = () => {
  const HomeStack = createNativeStackNavigator<HomeStackParamList>();

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="CommunityStack"
        component={CommunityStackNavigator}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Notice"
        component={NoticeScreen}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
