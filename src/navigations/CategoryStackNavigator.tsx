import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CategoryScreen from '../screens/categoryStack/CategoryScreen';
import React from 'react';
import PlayerListScreen from '../screens/categoryStack/PlayerListScreen';
import CommunityScreen from '../screens/categoryStack/CommunityScreen';
import PostWriteScreen from '../screens/categoryStack/PostWriteScreen';
import PostScreen from '../screens/categoryStack/PostScreen';

export type CategoryStackParamList = {
  Category: {teamId: number};
  PlayerList: undefined;
  Community: {playerId: number};
  PostWrite: {playerId: number};
  Post: {postId: number};
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
      <CategoryStack.Screen
        name="Community"
        component={CommunityScreen}
        options={{headerShown: false}}
      />
      <CategoryStack.Screen
        name="PostWrite"
        component={PostWriteScreen}
        options={{headerShown: false}}
      />
      <CategoryStack.Screen
        name="Post"
        component={PostScreen}
        options={{headerShown: false}}
      />
    </CategoryStack.Navigator>
  );
};

export default CategoryStackNavigator;
