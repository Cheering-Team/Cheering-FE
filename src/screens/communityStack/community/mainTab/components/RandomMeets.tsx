import {Fan} from 'apis/fan/types';
import {MeetInfo} from 'apis/meet/types';
import CustomText from 'components/common/CustomText';
import React from 'react';
import {View} from 'react-native';
import MeetCard from '../../meetTab/components/MeetCard';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {useNavigation} from '@react-navigation/native';
import {useGetCommunityById} from 'apis/community/useCommunities';
import {Community} from 'apis/community/types';

interface RandomMeetsProps {
  meets: MeetInfo[] | undefined;
  curUser: Fan | undefined;
  community: Community;
}

const RandomMeets = ({meets, curUser, community}: RandomMeetsProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  return (
    <View className="mt-3">
      <CustomText className="ml-[14] text-lg mb-2" fontWeight="500">
        {`${curUser?.name}님을 위한 추천 모임`}
      </CustomText>
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
