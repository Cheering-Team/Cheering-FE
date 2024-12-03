import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AdminScreen from 'screens/homeStack/AdminScreen';
import ChangeOrderScreen from 'screens/homeStack/ChangeOrderScreen';
import HomeMyScreen from 'screens/homeStack/homeTab/HomeMyScreen';

const HomeMyStack = createNativeStackNavigator<HomeMyStackParamList>();

export type HomeMyStackParamList = {
  HomeMy: undefined;
  ChangeOrder: undefined;
  Admin: undefined;
};

const HomeMyStackNavigator = () => {
  return (
    <HomeMyStack.Navigator>
      <HomeMyStack.Screen
        name="HomeMy"
        component={HomeMyScreen}
        options={{
          headerShown: false,
        }}
      />
      <HomeMyStack.Screen
        name="ChangeOrder"
        component={ChangeOrderScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
          animationDuration: 400,
        }}
      />
      <HomeMyStack.Screen
        name="Admin"
        component={AdminScreen}
        options={{
          headerShown: false,
        }}
      />
    </HomeMyStack.Navigator>
  );
};

export default HomeMyStackNavigator;
