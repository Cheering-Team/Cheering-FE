import React from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import BackSvg from '../../../assets/images/arrow-left.svg';
import ChevronRightSvg from '../../../assets/images/chevron-right-gray.svg';
import CustomText from '../../components/common/CustomText';
import {useGetUserInfo} from 'apis/user/useUsers';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MoreStackParamList} from 'navigations/MoreStackNavigator';

type MyProfileScreenNavigationProp = NativeStackNavigationProp<
  MoreStackParamList,
  'MyProfile'
>;

const MyProfileScreen = ({
  navigation,
}: {
  navigation: MyProfileScreenNavigationProp;
}) => {
  const {data, isLoading} = useGetUserInfo();

  if (isLoading || !data) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row justify-between items-center p-[10]">
        <Pressable onPress={() => navigation.goBack()}>
          <BackSvg width={32} height={32} />
        </Pressable>

        <CustomText fontWeight="600" className="text-xl">
          내 정보 수정
        </CustomText>
        <View className="w-8 h-8" />
      </View>
      <View className="p-5">
        <Pressable
          className="border border-slate-200 p-[18] flex-row items-center justify-between rounded-lg"
          onPress={() =>
            navigation.navigate('EditNickname', {
              nickname: data.result.nickname,
              playerUserId: null,
            })
          }>
          <CustomText fontWeight="600" className="text-lg">
            닉네임
          </CustomText>
          <View className="flex-row items-center">
            <CustomText
              fontWeight="500"
              className="text-gray-400 text-[17px] mr-1">
              {data.result.nickname}
            </CustomText>
            <ChevronRightSvg width={13} height={13} />
          </View>
        </Pressable>
        <View className="flex-row justify-center mt-7">
          <Pressable onPress={() => navigation.replace('SignOut')}>
            <CustomText className="text-gray-400 text-base">
              로그아웃
            </CustomText>
          </Pressable>
          <CustomText className="mx-2 text-gray-400 text-sm">|</CustomText>
          <Pressable
            onPress={() =>
              navigation.navigate('DeleteUser', {playerUserId: null})
            }>
            <CustomText className="text-gray-400 text-base">
              회원탈퇴
            </CustomText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyProfileScreen;
