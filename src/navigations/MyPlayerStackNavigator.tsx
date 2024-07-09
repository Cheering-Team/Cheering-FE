import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MyPlayerScreen from '../screens/myPlayerStack/MyPlayerScreen';
import CommunityScreen from '../screens/categoryStack/CommunityScreen';

export type MyPlayerStackParamList = {
  MyPlayer: undefined;
  Community: {playerId: number};
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
    </MyPlayerStack.Navigator>
  );
};

export default MyPlayerStackNavigator;
