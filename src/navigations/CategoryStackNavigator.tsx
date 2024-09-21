import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CategoryScreen from '../screens/categoryStack/CategoryScreen';
import React from 'react';
import PlayerListScreen from '../screens/categoryStack/PlayerListScreen';
import SearchScreen from '../screens/categoryStack/SearchScreen';
import CommunityStackNavigator from './CommunityStackNavigator';

export type CategoryStackParamList = {
  Category: {teamId: number};
  Search: undefined;
  PlayerList: {teamId: number};
  CommunityStack: undefined;
};

const CategoryStackNavigator = () => {
  const CategoryStack = createNativeStackNavigator<CategoryStackParamList>();
  return (
    <CategoryStack.Navigator>
      <CategoryStack.Screen
        name="Category"
        component={CategoryScreen}
        options={{headerShown: false}}
      />
      <CategoryStack.Screen
        name="Search"
        component={SearchScreen}
        options={{headerShown: false, animation: 'none'}}
      />
      <CategoryStack.Screen name="PlayerList" component={PlayerListScreen} />
      <CategoryStack.Screen
        name="CommunityStack"
        component={CommunityStackNavigator}
        options={{headerShown: false}}
      />
    </CategoryStack.Navigator>
  );
};

export default CategoryStackNavigator;
