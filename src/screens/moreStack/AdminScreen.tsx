import CustomText from 'components/common/CustomText';
import StackHeader from 'components/common/StackHeader';
import React from 'react';
import {FlatList, Pressable, SafeAreaView} from 'react-native';
import ChevronRightSvg from '../../assets/images/chevron-right-gray.svg';

const ADMIN_BOARD = [{title: '선수 계정 관리'}, {title: '선수 등록 관리'}];

const AdminScreen = ({navigation}) => {
  return (
    <SafeAreaView className="flex-1">
      <StackHeader title="관리자" type="back" />
      <FlatList
        data={ADMIN_BOARD}
        renderItem={({item}) => (
          <Pressable
            className="px-3 py-2 flex-row items-center justify-between"
            onPress={() => navigation.navigate('PlayerAccount')}>
            <CustomText className="text-lg">{item.title}</CustomText>
            <ChevronRightSvg />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default AdminScreen;
