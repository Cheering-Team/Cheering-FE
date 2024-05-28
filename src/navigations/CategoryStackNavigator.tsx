import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CategoryScreen from '../screens/categoryStack/CategoryScreen';
import React from 'react';
import PlayerListScreen from '../screens/categoryStack/PlayerListScreen';

export type CategoryStackParamList = {
  Category: {teamId: number};
  PlayerList: undefined;
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
      <CategoryStack.Screen name="PlayerList" component={PlayerListScreen} />
    </CategoryStack.Navigator>
  );
};

export default CategoryStackNavigator;
