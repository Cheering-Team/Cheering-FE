import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AdminScreen from 'screens/homeStack/adminStack/AdminScreen';
import MatchEditScreen from 'screens/homeStack/adminStack/MatchEditScreen';
import MatchResultScreen from 'screens/homeStack/adminStack/MatchResultScreen';

const AdminStack = createNativeStackNavigator<AdminStackParamList>();

export type AdminStackParamList = {
  Admin: undefined;
  MatchResult: undefined;
  MatchEdit: {matchId: number};
};

const AdminStackNavigator = () => {
  return (
    <AdminStack.Navigator screenOptions={{animation: 'ios_from_right'}}>
      <AdminStack.Screen
        name="Admin"
        component={AdminScreen}
        options={{
          headerShown: false,
        }}
      />
      <AdminStack.Screen
        name="MatchResult"
        component={MatchResultScreen}
        options={{
          headerShown: false,
        }}
      />
      <AdminStack.Screen
        name="MatchEdit"
        component={MatchEditScreen}
        options={{
          headerShown: false,
        }}
      />
    </AdminStack.Navigator>
  );
};

export default AdminStackNavigator;
