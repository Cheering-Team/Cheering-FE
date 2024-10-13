import React from 'react';
import {Pressable, SafeAreaView, View} from 'react-native';
import ChevronRightSvg from '../../../assets/images/chevron-right-gray.svg';
import CustomText from '../../components/common/CustomText';
import {useGetUserInfo} from 'apis/user/useUsers';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MoreStackParamList} from 'navigations/MoreStackNavigator';
import StackHeader from 'components/common/StackHeader';

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
      <StackHeader title="내 정보 수정" type="back" />
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
        {data.result.role === 'ROLE_ADMIN' && (
          <Pressable
            className="border border-slate-200 p-[18] flex-row items-center justify-between rounded-lg mt-4"
            onPress={() => navigation.navigate('Admin')}>
            <CustomText fontWeight="600" className="text-lg">
              관리자
            </CustomText>
            <View className="flex-row items-center">
              <ChevronRightSvg width={13} height={13} />
            </View>
          </Pressable>
        )}
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
