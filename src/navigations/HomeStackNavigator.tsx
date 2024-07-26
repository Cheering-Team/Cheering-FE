import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/homeStack/HomeScreen';
import CommunityStackNavigator from './CommunityStackNavigator';

export type HomeStackParamList = {
  Home: undefined;
  CommunityStack: undefined;
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
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
