import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import CommunityStackNavigator, {
  CommunityStackParamList,
} from './CommunityStackNavigator';
import MyChatScreen from '../screens/myChatStack/MyChatScreen';
import {NavigationPropType} from './types';

export type MyChatStackParamList = {
  MyChat: undefined;
  CommunityStack: NavigationPropType<CommunityStackParamList>;
};

const MyChatStackNavigator = () => {
  const MyChatStack = createNativeStackNavigator<MyChatStackParamList>();

  return (
    <MyChatStack.Navigator>
      <MyChatStack.Screen
        name="MyChat"
        component={MyChatScreen}
        options={{headerShown: false}}
      />
      <MyChatStack.Screen
        name="CommunityStack"
        component={CommunityStackNavigator}
        options={{headerShown: false}}
      />
    </MyChatStack.Navigator>
  );
};

export default MyChatStackNavigator;
