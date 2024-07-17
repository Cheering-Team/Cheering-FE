import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeStackNavigator from './HomeStackNavigator';
import MyChatScreen from '../screens/MyChatScreen';
import CategoryStackNavigator from './CategoryStackNavigator';
import MyPlayerStackNavigator from './MyPlayerStackNavigator';
import MoreStackNavigator from './MoreStackNavigator';
import CustomTabBar from '../components/common/CustomHomeTab';

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
        name="CategoryStack"
        component={CategoryStackNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="MyPlayerStack"
        component={MyPlayerStackNavigator}
        options={{
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="MyChat"
        component={MyChatScreen}
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
