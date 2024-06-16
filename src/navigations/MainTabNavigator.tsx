import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import CustomTabBar from '../components/CustomHomeTab';
import HomeStackNavigator from './HomeStackNavigator';
import MyCommunityScreen from '../screens/mainTab/MyCommunityScreen';
import MyChatScreen from '../screens/mainTab/MyChatScreen';
import MyPageScreen from '../screens/mainTab/MyPageScreen';
import CategoryStackNavigator from './CategoryStackNavigator';

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
        name="MyCommunity"
        component={MyCommunityScreen}
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
