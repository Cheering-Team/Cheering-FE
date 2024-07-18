import React from 'react';
import CommunityScreen from '../screens/categoryStack/CommunityScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/homeStack/HomeScreen';
import PostScreen from '../screens/categoryStack/PostScreen';
import ProfileScreen from '../screens/categoryStack/ProfileScreen';
import PostWriteScreen from '../screens/categoryStack/PostWriteScreen';

export type HomeStackParamList = {
  Home: undefined;
  Post: {postId: number};
  Community: {playerId: number};
  Profile: {playerUserId: number};
  PostWrite: {playerId: number};
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
        name="PostWrite"
        component={PostWriteScreen}
        options={{headerShown: false}}
      />

      <HomeStack.Screen
        name="Community"
        component={CommunityScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
