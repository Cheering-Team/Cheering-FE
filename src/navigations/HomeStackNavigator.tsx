import React from 'react';
import SearchScreen from '../screens/SearchScreen';
import SignOutScreen from '../screens/auth/SignOutScreen';
import CommunityScreen from '../screens/community/CommunityScreen';
import WriteScreen from '../screens/WriteScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PostScreen from '../screens/PostScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import SettingScreen from '../screens/SettingScreen';
import HomeScreen from '../screens/homeStack/HomeScreen';

export type HomeStackParamList = {
  Home: undefined;
  Search: undefined;
  Community: {communityId: number};
  Post: {communityId: number; postId: number; type: 'To' | 'From'};
  SignOut: undefined;
  Write: {communityId: number};
  ChatRoom: undefined;
  Setting: undefined;
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
        name="Search"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          headerTransparent: true,
        }}
      />
      <HomeStack.Screen
        name="Post"
        component={PostScreen}
        options={{headerStyle: {backgroundColor: 'red'}}}
      />
      <HomeStack.Screen
        name="Write"
        component={WriteScreen}
        options={{
          headerShadowVisible: false,
          headerTitleAlign: 'center',
        }}
      />
      <HomeStack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{
          headerShadowVisible: false,
          headerTitleAlign: 'center',
        }}
      />
      <HomeStack.Screen name="Setting" component={SettingScreen} />
      <HomeStack.Screen
        name="SignOut"
        component={SignOutScreen}
        options={{
          headerTitle: '',
          headerBackVisible: false,
          headerTransparent: true,
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
