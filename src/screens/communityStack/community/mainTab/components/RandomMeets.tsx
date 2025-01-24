import {Fan} from 'apis/fan/types';
import {MeetInfo} from 'apis/meet/types';
import CustomText from 'components/common/CustomText';
import React from 'react';
import {Pressable, View} from 'react-native';
import MeetCard from '../../meetTab/components/MeetCard';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import {useNavigation} from '@react-navigation/native';
import {Community} from 'apis/community/types';

interface RandomMeetsProps {
  meets: MeetInfo[] | undefined;
  curUser: Fan | undefined;
  community: Community;
  onTabPress: (index: number) => void;
}

const RandomMeets = ({
  meets,
  curUser,
  community,
  onTabPress,
}: RandomMeetsProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  return (
    <View className="mt-3">
      <View className="flex-row items-center justify-between mx-[14] mb-1">
        <CustomText className="text-lg flex-1" fontWeight="500">
          <CustomText
            className="text-lg flex-1"
            fontWeight="500"
            style={{color: community.color}}>
            {curUser?.name}
          </CustomText>
          {` 님을 위한 추천 모임`}
        </CustomText>
        <Pressable
          className="border-b border-b-gray-600"
          onPress={() => onTabPress(4)}>
          <CustomText className="text-gray-600 text-[13px]">
            전체보기
          </CustomText>
        </Pressable>
      </View>

      {meets?.slice(0, 3).map(meet => (
        <MeetCard
          key={meet.id}
          meet={meet}
          type="MAIN"
          onPress={() => {
            navigation.navigate('MeetRecruit', {meetId: meet.id, community});
          }}
        />
      ))}
      {meets?.length === 0 && (
        <View className="h-[80] justify-center items-center">
          <CustomText className="text-slate-700">
            조건에 맞는 모임이 없어요
          </CustomText>
        </View>
      )}
    </View>
  );
};

export default RandomMeets;
