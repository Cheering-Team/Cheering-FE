import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import CommunityStackNavigator from './CommunityStackNavigator';
import MyAlertScreen from '../screens/myAlertStack/MyAlertScreen';

export type MyAlertStackParamList = {
  MyAlert: undefined;
  CommunityStack: undefined;
};

const MyAlertStackNavigator = () => {
  const MyAlertStack = createNativeStackNavigator<MyAlertStackParamList>();

  return (
    <MyAlertStack.Navigator>
      <MyAlertStack.Screen
        name="MyAlert"
        component={MyAlertScreen}
        options={{headerTitle: '알림'}}
      />
      <MyAlertStack.Screen
        name="CommunityStack"
        component={CommunityStackNavigator}
        options={{headerShown: false}}
      />
    </MyAlertStack.Navigator>
  );
};

export default MyAlertStackNavigator;
