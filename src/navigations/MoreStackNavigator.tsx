import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MoreScreen from '../screens/moreStack/MoreScreen';
import MyProfileScreen from '../screens/moreStack/MyProfileScreen';
import SignOutScreen from '../screens/moreStack/SignOutScreen';
import EditNicknameScreen from '../screens/moreStack/EditNicknameScreen';
import DeleteUserScreen from '../screens/moreStack/DeleteUserScreen';
import SetNotificationScreen from '../screens/moreStack/SetNotificationScreen';
import NotificationScreen from 'screens/notificationStack/NotificaitonScreen';
import NoticeListScreen from 'screens/moreStack/NoticeListScreen';
import NoticeScreen from 'screens/moreStack/NoticeScreen';

export type MoreStackParamList = {
  More: undefined;
  MyProfile: undefined;
  EditNickname: {nickname: string; playerUserId: null};
  DeleteUser: {playerUserId: null};
  NoticeList: undefined;
  Notice: {noticeId: number};
  SetNotification: undefined;
  SignOut: undefined;
};

const MoreStackNavigator = () => {
  const MoreStack = createNativeStackNavigator<MoreStackParamList>();

  return (
    <MoreStack.Navigator>
      <MoreStack.Screen
        name="More"
        component={MoreScreen}
        options={{headerShown: false}}
      />
      <MoreStack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{headerShown: false}}
      />
      <MoreStack.Screen
        name="EditNickname"
        component={EditNicknameScreen}
        options={{headerShown: false}}
      />
      <MoreStack.Screen
        name="DeleteUser"
        component={DeleteUserScreen}
        options={{headerShown: false}}
      />
      <MoreStack.Screen
        name="NoticeList"
        component={NoticeListScreen}
        options={{headerShown: false}}
      />
      <MoreStack.Screen
        name="Notice"
        component={NoticeScreen}
        options={{headerShown: false}}
      />
      <MoreStack.Screen
        name="SetNotification"
        component={SetNotificationScreen}
        options={{headerShown: false}}
      />
      <MoreStack.Screen
        name="SignOut"
        component={SignOutScreen}
        options={{headerShown: false}}
      />
    </MoreStack.Navigator>
  );
};

export default MoreStackNavigator;
