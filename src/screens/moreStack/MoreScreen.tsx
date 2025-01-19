import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import ChevronRightSvg from '../../assets/images/chevron-right-gray.svg';
import CustomText from '../../components/common/CustomText';
import {useGetUserInfo} from 'apis/user/useUsers';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MoreStackParamList} from 'navigations/MoreStackNavigator';
import BellSvg from '../../assets/images/bell-line.svg';
import NoticeSvg from '../../assets/images/megaphone-black.svg';
import LockSvg from '../../assets/images/lock.svg';
import StackHeader from 'components/common/StackHeader';
import ApplySvg from 'assets/images/apply-black.svg';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';

type MoreScreenNavigationProp = NativeStackNavigationProp<
  MoreStackParamList,
  'More'
>;

const MoreScreen = ({navigation}: {navigation: MoreScreenNavigationProp}) => {
  useDarkStatusBar();

  const {data, isLoading} = useGetUserInfo();

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1">
      <StackHeader title="계정 및 설정" type="none" />
      <ScrollView className="flex-1">
        <View className="pt-3 px-3 bg-white">
          <CustomText
            fontWeight="500"
            className="color-[#5c5c5c] text-[13px] py-2">
            내 계정
          </CustomText>
          <Pressable
            className="flex-row justify-between items-center py-[10]"
            onPress={() => navigation.navigate('MyProfile')}>
            <CustomText fontWeight="500" className="text-lg mr-1 pb-[1]">
              {data?.name}
            </CustomText>
            <ChevronRightSvg width={16} height={16} />
          </Pressable>
          <Pressable
            className="flex-row justify-between items-center py-[10]"
            onPress={() => {
              navigation.navigate('CommunityApplyList');
            }}>
            <View className="flex-row items-center">
              <ApplySvg width={20} height={20} />
              <CustomText fontWeight="400" className="text-base pb-[1] ml-3">
                커뮤니티 신청 내역
              </CustomText>
            </View>
            <ChevronRightSvg width={16} height={16} />
          </Pressable>
        </View>
        <View className="mt-[6] pt-3 px-3 bg-white">
          <CustomText
            fontWeight="500"
            className="color-[#5c5c5c] text-[13px] py-2">
            소식
          </CustomText>
          <Pressable
            className="flex-row justify-between items-center py-[10]"
            onPress={() => {
              navigation.navigate('NoticeList');
            }}>
            <View className="flex-row items-center">
              <NoticeSvg width={20} height={20} />
              <CustomText fontWeight="400" className="text-base pb-[1] ml-3">
                공지사항
              </CustomText>
            </View>
            <ChevronRightSvg width={16} height={16} />
          </Pressable>
        </View>
        <View className="mt-[6] pt-3 px-3 bg-white">
          <CustomText
            fontWeight="500"
            className="color-[#5c5c5c] text-[13px] py-2">
            설정
          </CustomText>
          <Pressable
            className="flex-row justify-between items-center py-[10]"
            onPress={() => {
              navigation.navigate('SetNotification');
            }}>
            <View className="flex-row items-center">
              <BellSvg width={20} height={20} />
              <CustomText fontWeight="400" className="text-base pb-[1] ml-3">
                알림
              </CustomText>
            </View>
            <ChevronRightSvg width={16} height={16} />
          </Pressable>
        </View>
        <View className="mt-[6] pt-3 px-3 bg-white">
          <CustomText
            fontWeight="500"
            className="color-[#5c5c5c] text-[13px] py-2">
            정보 및 지원
          </CustomText>
          <Pressable
            className="flex-row justify-between items-center py-[10]"
            onPress={() => {
              navigation.navigate('PrivacyPolicy');
            }}>
            <View className="flex-row items-center">
              <LockSvg width={20} height={20} />
              <CustomText fontWeight="400" className="text-base pb-[1] ml-3">
                개인정보 처리방침
              </CustomText>
            </View>
            <ChevronRightSvg width={16} height={16} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoreScreen;
