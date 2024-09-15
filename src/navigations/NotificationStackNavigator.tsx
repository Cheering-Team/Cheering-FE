import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import CommunityStackNavigator from './CommunityStackNavigator';
import NotificationScreen from '../screens/notificationStack/NotificaitonScreen';

export type NotificationStackParamList = {
  Notification: undefined;
  CommunityStack: undefined;
};

const NotificationStackNavigator = () => {
  const NotificationStack =
    createNativeStackNavigator<NotificationStackParamList>();

  return (
    <NotificationStack.Navigator>
      <NotificationStack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{headerShown: false}}
      />
      <NotificationStack.Screen
        name="CommunityStack"
        component={CommunityStackNavigator}
        options={{headerShown: false}}
      />
    </NotificationStack.Navigator>
  );
};

export default NotificationStackNavigator;
