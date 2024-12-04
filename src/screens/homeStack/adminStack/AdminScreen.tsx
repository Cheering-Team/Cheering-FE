import CustomText from 'components/common/CustomText';
import React from 'react';
import {FlatList, Pressable, SafeAreaView} from 'react-native';
import ChevronRightSvg from 'assets/images/chevron-right-gray.svg';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AdminStackParamList} from 'navigations/AdminStackNavigator';
import {useNavigation} from '@react-navigation/native';
import StackHeader from 'components/common/StackHeader';

const ADMIN_BOARD = [{title: '경기 결과 관리'}];

const AdminScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  return (
    <SafeAreaView className="flex-1">
      <StackHeader title="관리" />
      <FlatList
        data={ADMIN_BOARD}
        renderItem={({item}) => (
          <Pressable
            className="px-3 py-2 flex-row items-center justify-between"
            onPress={() => navigation.navigate('MatchResult')}>
            <CustomText className="text-lg">{item.title}</CustomText>
            <ChevronRightSvg />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default AdminScreen;
