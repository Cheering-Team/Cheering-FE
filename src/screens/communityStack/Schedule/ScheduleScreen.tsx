import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomText from 'components/common/CustomText';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React from 'react';
import {Pressable, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CloseSvg from 'assets/images/close-black.svg';

import {useGetCommunityById} from 'apis/community/useCommunities';
import ScheduleList from './components/ScheduleList';

const ScheduleScreen = () => {
  const {communityId} =
    useRoute<RouteProp<CommunityStackParamList, 'Schedule'>>().params;
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const {data: community} = useGetCommunityById(communityId);

  if (!community) {
    return null;
  }

  return (
    <>
      <View
        className="px-[5] flex-row justify-between items-center bg-white z-50 border-b border-b-gray-200"
        style={{
          paddingTop: insets.top,
          height: 50 + insets.top,
        }}>
        <Pressable className="pr-[28]" onPress={() => navigation.goBack()}>
          <CloseSvg width={32} height={32} />
        </Pressable>

        <View className="items-center">
          <CustomText fontWeight="600" className="text-lg top-[1]">
            경기 일정
          </CustomText>
          <CustomText className="text-gray-600">
            {community.koreanName}
          </CustomText>
        </View>
        <View className="flex-row items-center pr-1 w-[65]">
          <View
            className="w-5 h-5 rounded-md mr-1"
            style={{backgroundColor: community.color}}
          />
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
