import React from 'react';
import {PlayerUser} from './CategoryStackNavigator';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CommunityScreen from '../screens/communityStack/CommunityScreen';
import ProfileScreen from '../screens/communityStack/ProfileScreen';
import PostWriteScreen from '../screens/communityStack/PostWriteScreen';
import PostScreen from '../screens/communityStack/PostScreen';
import ProfileEditScreen from '../screens/communityStack/ProfileEditScreen';

export type CommunityStackParamList = {
  Community: {playerId: number};
  PostWrite: {playerId: number};
  Post: {postId: number; playerUser: PlayerUser};
  Profile: {playerUserId: number};
  ProfileEdit: {playerUserId: number};
};

const CommunityStackNavigator = () => {
  const CommunityStack = createNativeStackNavigator<CommunityStackParamList>();
  return (
    <CommunityStack.Navigator>
      <CommunityStack.Screen
        name="Community"
        component={CommunityScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="PostWrite"
        component={PostWriteScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="Post"
        component={PostScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{headerShown: false}}
      />
    </CommunityStack.Navigator>
  );
};

export default CommunityStackNavigator;
