import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomText from 'components/common/CustomText';
import StackHeader from 'components/common/StackHeader';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {HomeStackParamList} from 'navigations/HomeStackNavigator';
import React from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import {queryClient} from '../../../App';

interface NotFoundProps {
  type: 'FAN' | 'POST';
}

const NotFound = ({type}: NotFoundProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  return (
    <SafeAreaView className="flex-1">
      <StackHeader />
      <View className="h-[50%] items-center justify-center">
        <CustomText className="text-xl" fontWeight="600">
          {type === 'FAN' && '존재하지 않는 사용자입니다'}
          {type === 'POST' && '존재하지 않는 게시글입니다'}
        </CustomText>
        <Pressable
          className="bg-black p-2 rounded-md mt-3"
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{name: 'HomeStack'}],
            });
            queryClient.invalidateQueries();
          }}>
          <CustomText className="text-white text-base" fontWeight="500">
            홈으로 이동
          </CustomText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default NotFound;
