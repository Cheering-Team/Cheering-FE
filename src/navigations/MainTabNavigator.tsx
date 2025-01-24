import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeStackNavigator from './HomeStackNavigator';
import CategoryStackNavigator from './CategoryStackNavigator';
import MoreStackNavigator from './MoreStackNavigator';
import MyChatStackNavigator from './MyChatStackNavigator';
import CustomTabBar from 'components/common/CustomTabBar';

const MainTabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="CategoryStack"
        component={CategoryStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="MyChatStack"
        component={MyChatStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="MoreStack"
        component={MoreStackNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
