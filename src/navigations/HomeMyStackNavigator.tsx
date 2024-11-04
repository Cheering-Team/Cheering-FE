import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import ChangeOrderScreen from 'screens/homeStack/ChangeOrderScreen';
import HomeMyScreen from 'screens/homeStack/homeTab/HomeMyScreen';

const HomeMyStack = createNativeStackNavigator();

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
          animation: 'fade',
          animationDuration: 200,
        }}
      />
    </HomeMyStack.Navigator>
  );
};

export default HomeMyStackNavigator;
