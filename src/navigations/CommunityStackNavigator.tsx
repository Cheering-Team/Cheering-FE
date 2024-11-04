import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Post} from 'apis/post/types';
import {Fan} from 'apis/fan/types';
import ScheduleScreen from 'screens/Community/Schedule/ScheduleScreen';
import {Community} from 'apis/community/types';
import MatchScreen from 'screens/Community/Schedule/MatchScreen';
import CommunityScreen from 'screens/Community/CommunityScreen';
import ProfileScreen from 'screens/Community/ProfileScreen';
import PostWriteScreen from 'screens/Community/PostWriteScreen';
import PostScreen from 'screens/Community/PostScreen';
import DailyScreen from 'screens/Community/DailyScreen';
import ChatRoomScreen from 'screens/Community/ChatRoomScreen';
import CreateChatRoomScreen from 'screens/Community/CreateChatRoomScreen';
import ChatRoomEnterScreen from 'screens/Community/ChatRoomEnterScreen';
import ProfileEditScreen from 'screens/Community/ProfileEditScreen';
import EditNameScreen from 'screens/moreStack/EditNameScreen';
import DeletePlayerUserScreen from 'screens/Community/DeleteFanScreen';
import BlockListScreen from 'screens/Community/BlockListScreen';
import {SafeAreaView} from 'react-native';

export type CommunityStackParamList = {
  Community: {communityId: number};
  PostWrite: {communityId: number; post?: Post};
  Post: {postId: number};
  Daily: {communityId: number; date: string; write: boolean; user: Fan};
  ChatRoom: {chatRoomId: number};
  CreateChatRoom: {communityId: number};
  ChatRoomEnter: {chatRoomId: number};
  Profile: {fanId: number};
  ProfileEdit: {fanId: number};
  EditName: {name: string; fanId: number | null};
  DeleteFan: {fanId: number};
  BlockList: {playerUserId: number};
  Schedule: {community: Community};
  Match: {matchId: number; community: Community};
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
        name="DeleteFan"
        component={DeletePlayerUserScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="BlockList"
        component={BlockListScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="Match"
        component={MatchScreen}
        options={{headerShown: false}}
      />
    </CommunityStack.Navigator>
  );
};

export default CommunityStackNavigator;
