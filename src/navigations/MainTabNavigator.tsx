import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import CustomTabBar from '../components/CustomHomeTab';
import HomeStackNavigator from './HomeStackNavigator';
import MyChatScreen from '../screens/mainTab/MyChatScreen';
import MyPageScreen from '../screens/mainTab/MyPageScreen';
import CategoryStackNavigator from './CategoryStackNavigator';
import MyPlayerStackNavigator from './MyPlayerStackNavigator';

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
        name="MyPage"
        component={MyPageScreen}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
