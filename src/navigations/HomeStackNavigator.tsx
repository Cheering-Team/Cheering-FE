import React from 'react';
import CommunityScreen from '../screens/categoryStack/CommunityScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/homeStack/HomeScreen';
import PostScreen from '../screens/categoryStack/PostScreen';

export type HomeStackParamList = {
  Home: undefined;
  Post: {postId: number};
  Community: {playerId: number};
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
        name="Post"
        component={PostScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Community"
        component={CommunityScreen}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
