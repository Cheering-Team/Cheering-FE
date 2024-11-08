import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomText from 'components/common/CustomText';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React from 'react';
import {Pressable, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CloseSvg from 'assets/images/close-black.svg';
import FastImage from 'react-native-fast-image';
import ScheduleList from './components/ScheduleList';

const ScheduleScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const {community} =
    useRoute<RouteProp<CommunityStackParamList, 'Schedule'>>().params;
  const insets = useSafeAreaInsets();

  return (
    <>
      <View
        className="px-[5] flex-row justify-between items-center bg-white z-50 border-b border-b-gray-200"
        style={{
          paddingTop: insets.top,
          height: 48 + insets.top,
        }}>
        <Pressable className="pr-[28]" onPress={() => navigation.goBack()}>
          <CloseSvg width={32} height={32} />
        </Pressable>

        <View className="flex-row items-center">
          <FastImage
            source={{
              uri: community.image,
            }}
            className="w-[35] h-[35] rounded-full mr-1"
          />
          <CustomText fontWeight="500" className="text-lg pb-0">
            {community.koreanName}
          </CustomText>
        </View>
        <View className="flex-row items-center pr-1 w-[65]">
          <View className="w-5 h-5 bg-[#ffa6a6] rounded-md mr-1" />
          <CustomText className="text-[#000000]" fontWeight="600">
            홈경기
          </CustomText>
        </View>
      </View>
      <ScheduleList community={community} />
    </>
  );
};

export default ScheduleScreen;
