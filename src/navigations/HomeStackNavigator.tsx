import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/homeStack/HomeScreen';
import CommunityStackNavigator from './CommunityStackNavigator';
import NoticeScreen from 'screens/moreStack/NoticeScreen';

export type HomeStackParamList = {
  Home: undefined;
  CommunityStack: undefined;
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
