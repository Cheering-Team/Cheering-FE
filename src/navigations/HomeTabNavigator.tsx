import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import HomeHotScreen from 'screens/homeStack/homeTab/HomeHotScreen';
import {SafeAreaView} from 'react-native';
import HomeTabBar from 'screens/homeStack/homeTab/components/HomeTabBar';
import HomeMyStackNavigator, {
  HomeMyStackParamList,
} from './HomeMyStackNavigator';
import {NavigationPropType} from './types';

export type HomeTabParamList = {
  MY: NavigationPropType<HomeMyStackParamList>;
  HOT: undefined;
};

const Tab = createMaterialTopTabNavigator<HomeTabParamList>();

const HomeTabNavigator = () => {
  return (
    <SafeAreaView className="flex-1">
      <Tab.Navigator
        tabBar={HomeTabBar}
        screenOptions={{
          swipeEnabled: false,
          tabBarStyle: {
            width: '50%',
            alignSelf: 'center',
          },
        }}>
        <Tab.Screen name="MY" component={HomeMyStackNavigator} />
        <Tab.Screen name="HOT" component={HomeHotScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default HomeTabNavigator;
