import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MyPlayerScreen from '../screens/myPlayerStack/MyPlayerScreen';
import CommunityStackNavigator from './CommunityStackNavigator';

export type MyPlayerStackParamList = {
  MyPlayer: undefined;
  CommunityStack: undefined;
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
        name="CommunityStack"
        component={CommunityStackNavigator}
        options={{headerShown: false}}
      />
    </MyPlayerStack.Navigator>
  );
};

export default MyPlayerStackNavigator;
