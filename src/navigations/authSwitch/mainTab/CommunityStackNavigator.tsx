import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Post} from 'apis/post/types';
import {Fan} from 'apis/fan/types';
import {Community} from 'apis/community/types';
import MatchScreen from 'screens/communityStack/match/MatchScreen';
import CommunityScreen from 'screens/communityStack/community/CommunityScreen';
import ProfileScreen from 'screens/communityStack/ProfileScreen';
import PostWriteScreen from 'screens/communityStack/postWrite/PostWriteScreen';
import PostScreen from 'screens/communityStack/PostScreen';
import DailyScreen from 'screens/communityStack/DailyScreen';
import ChatRoomScreen from 'screens/communityStack/chatRoom/ChatRoomScreen';
import CreateChatRoomScreen from 'screens/communityStack/CreateChatRoomScreen';
import ChatRoomEnterScreen from 'screens/communityStack/ChatRoomEnterScreen';
import ProfileEditScreen from 'screens/communityStack/ProfileEditScreen';
import EditNameScreen from 'screens/moreStack/EditNameScreen';
import LeaveCommunityScreen from 'navigations/authSwitch/mainTab/categoryStack/screens/leaveCommunity/LeaveCommunityScreen';
import BlockListScreen from 'screens/communityStack/BlockListScreen';

import CreateMeetScreen from 'screens/communityStack/CreateMeetScreen';
import MeetRecruitScreen from 'screens/communityStack/MeetRecruitScreen';
import MeetScreen from 'screens/communityStack/MeetScreen';
import MeetPrivateChatListScreen from 'screens/communityStack/MeetPrivateChatListScreen';
import MyMeetScreen from 'screens/communityStack/MyMeetScreen';
import MeetMemberListScreen from 'screens/communityStack/MeetMemberListScreen';
import EditMeetScreen from 'screens/communityStack/EditMeetScreen';
import ScheduleScreen from 'screens/communityStack/Schedule/ScheduleScreen';

export type CommunityStackParamList = {
  Community: {communityId: number; initialIndex: number};
  Join: undefined;
  PostWrite: {community: Community; post?: Post};
  Post: {postId: number};
  Daily: {communityId: number; date: string; write: boolean; user: Fan};
  ChatRoom: {
    chatRoomId: number;
    type: 'PRIVATE' | 'PUBLIC' | 'CONFIRM' | 'OFFICIAL';
  };
  CreateChatRoom: {community: Community};
  ChatRoomEnter: {chatRoomId: number};
  Profile: {fanId: number};
  ProfileEdit: {
    fanId: number;
    type: 'COMMUNITY' | 'MEET';
  };
  EditName: {name: string; type: 'COMMUNITY' | 'MEET'; fanId: number | null};
  LeaveCommunity: {communityId: number};
  BlockList: {playerUserId: number};
  Schedule: {communityId: number};
  Match: {matchId: number; communityId: number};
  CreateMeet: {community: Community};
  EditMeet: {communityId: number; meetId: number};
  MeetRecruit: {meetId: number; community: Community};
  Meet: {meetId: number; communityId: number};
  MeetPrivateChatList: {meetId: number; community: Community};
  MyMeet: {community: Community};
  MeetMeberList: {meetId: number; community: Community};
};

const CommunityStackNavigator = () => {
  const CommunityStack = createNativeStackNavigator<CommunityStackParamList>();
  return (
    <CommunityStack.Navigator screenOptions={{animation: 'ios_from_right'}}>
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
        options={{
          headerShown: false,
        }}
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
        options={{
          headerShown: false,
        }}
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
        name="LeaveCommunity"
        component={LeaveCommunityScreen}
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
      <CommunityStack.Screen
        name="CreateMeet"
        component={CreateMeetScreen}
        options={{
          headerShown: false,
        }}
      />
      <CommunityStack.Screen
        name="EditMeet"
        component={EditMeetScreen}
        options={{
          headerShown: false,
        }}
      />
      <CommunityStack.Screen
        name="MeetRecruit"
        component={MeetRecruitScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="Meet"
        component={MeetScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="MeetPrivateChatList"
        component={MeetPrivateChatListScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="MyMeet"
        component={MyMeetScreen}
        options={{headerShown: false}}
      />
      <CommunityStack.Screen
        name="MeetMeberList"
        component={MeetMemberListScreen}
        options={{headerShown: false}}
      />
    </CommunityStack.Navigator>
  );
};

export default CommunityStackNavigator;
