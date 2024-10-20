import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CommunityScreen from '../screens/communityStack/CommunityScreen';
import ProfileScreen from '../screens/communityStack/ProfileScreen';
import PostWriteScreen from '../screens/communityStack/PostWriteScreen';
import PostScreen from '../screens/communityStack/PostScreen';
import ProfileEditScreen from '../screens/communityStack/ProfileEditScreen';
import EditNameScreen from '../screens/moreStack/EditNameScreen';
import DeletePlayerUserScreen from '../screens/communityStack/DeletePlayerUserScreen';
import ChatRoomScreen from '../screens/communityStack/ChatRoomScreen';
import CreateChatRoomScreen from 'screens/communityStack/CreateChatRoomScreen';
import ChatRoomEnterScreen from 'screens/communityStack/ChatRoomEnterScreen';
import BlockListScreen from 'screens/communityStack/BlockListScreen';
import DailyScreen from 'screens/communityStack/DailyScreen';
import {Post} from 'apis/post/types';

export type CommunityStackParamList = {
  Community: {playerId: number};
  PostWrite: {playerId: number; feed?: Post};
  Post: {postId: number};
  Daily: {playerId: number; date: string; write: boolean};
  ChatRoom: {chatRoomId: number};
  CreateChatRoom: {playerId: number};
  ChatRoomEnter: {chatRoomId: number};
  Profile: {playerUserId: number};
  ProfileEdit: {playerUserId: number};
  EditName: {name: string; playerUserId: number | null};
  DeletePlayerUser: {playerUserId: number};
  BlockList: {playerUserId: number};
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
        name="Daily"
        component={DailyScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="CreateChatRoom"
        component={CreateChatRoomScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="ChatRoomEnter"
        component={ChatRoomEnterScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="EditName"
        component={EditNameScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="DeletePlayerUser"
        component={DeletePlayerUserScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="BlockList"
        component={BlockListScreen}
        options={{headerShown: false}}
      />
    </CommunityStack.Navigator>
  );
};

export default CommunityStackNavigator;
