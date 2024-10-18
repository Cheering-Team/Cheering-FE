import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MoreScreen from '../screens/moreStack/MoreScreen';
import MyProfileScreen from '../screens/moreStack/MyProfileScreen';
import SignOutScreen from '../screens/moreStack/SignOutScreen';
import EditNameScreen from '../screens/moreStack/EditNameScreen';
import DeleteUserScreen from '../screens/moreStack/DeleteUserScreen';
import SetNotificationScreen from '../screens/moreStack/SetNotificationScreen';
import NoticeListScreen from 'screens/moreStack/NoticeListScreen';
import NoticeScreen from 'screens/moreStack/NoticeScreen';
import PrivacyPolicyScreen from 'screens/moreStack/PrivacyPolicyScreen';
import AdminScreen from 'screens/moreStack/AdminScreen';
import PlayerAccountScreen from 'screens/moreStack/PlayerAccountScreen';

export type MoreStackParamList = {
  More: undefined;
  MyProfile: undefined;
  EditNickname: {nickname: string; playerUserId: null};
  DeleteUser: {playerUserId: null};
  NoticeList: undefined;
  Notice: {noticeId: number};
  SetNotification: undefined;
  PrivacyPolicy: undefined;
  Admin: undefined;
  PlayerAccount: undefined;
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
        component={EditNameScreen}
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
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{headerShown: false}}
      />
      <MoreStack.Screen
        name="SignOut"
        component={SignOutScreen}
        options={{headerShown: false}}
      />
      <MoreStack.Screen
        name="Admin"
        component={AdminScreen}
        options={{headerShown: false}}
      />
      <MoreStack.Screen
        name="PlayerAccount"
        component={PlayerAccountScreen}
        options={{headerShown: false}}
      />
    </MoreStack.Navigator>
  );
};

export default MoreStackNavigator;
