import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import HomeHotScreen from 'screens/homeStack/homeTab/HomeHotScreen';
import {SafeAreaView} from 'react-native';
import HomeTabBar from 'screens/homeStack/homeTab/components/HomeTabBar';
import HomeMyStackNavigator from './HomeMyStackNavigator';

const Tab = createMaterialTopTabNavigator();

const HomeTabNavigator = () => {
  return (
    <SafeAreaView className="flex-1">
      <Tab.Navigator
        tabBar={HomeTabBar}
        screenOptions={{
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
