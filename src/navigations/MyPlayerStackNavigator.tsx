import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MyPlayerScreen from '../screens/myPlayerStack/MyPlayerScreen';
import CommunityScreen from '../screens/categoryStack/CommunityScreen';
import PostScreen from '../screens/categoryStack/PostScreen';
import ProfileScreen from '../screens/categoryStack/ProfileScreen';
import PostWriteScreen from '../screens/categoryStack/PostWriteScreen';
import {PlayerUser} from './CategoryStackNavigator';

export type MyPlayerStackParamList = {
  MyPlayer: undefined;
  Community: {playerId: number};
  Post: {postId: number; playerUser: PlayerUser};
  Profile: {playerUserId: number};
  PostWrite: {playerId: number};
};

const MyPlayerStackNavigator = () => {
  const MyPlayerStack = createNativeStackNavigator<MyPlayerStackParamList>();

  return (
    <MyPlayerStack.Navigator>
      <MyPlayerStack.Screen
        name="MyPlayer"
        component={MyPlayerScreen}
        options={{headerTitle: '내 선수'}}
      />
      <MyPlayerStack.Screen
        name="Community"
        component={CommunityScreen}
        options={{headerShown: false}}
      />
      <MyPlayerStack.Screen
        name="Post"
        component={PostScreen}
        options={{headerShown: false}}
      />
      <MyPlayerStack.Screen
        name="PostWrite"
        component={PostWriteScreen}
        options={{headerShown: false}}
      />
      <MyPlayerStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
    </MyPlayerStack.Navigator>
  );
};

export default MyPlayerStackNavigator;
