import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useFindRandomFiveMeetsByCondition} from 'apis/meet/useMeets';
import {useGetUserInfo} from 'apis/user/useUsers';
import CustomText from 'components/common/CustomText';
import {HomeStackParamList} from 'navigations/authSwitch/mainTab/homeStack/HomeStackNavigator';
import React from 'react';
import {View} from 'react-native';
import MeetCard from 'screens/communityStack/community/meetTab/components/MeetCard';

const RecommendMeets = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const {data: meets} = useFindRandomFiveMeetsByCondition(0, true);
  const {data: user} = useGetUserInfo();

  if (meets?.length === 0) {
    return null;
  }

  return (
    <>
      <CustomText className="text-lg mt-5 mb-1 ml-4" fontWeight="500">
        {`${user?.name} 님을 위한 추천 모임`}
      </CustomText>
      <View className="mx-[14]">
        {meets?.slice(0, 3).map(meet => (
          <MeetCard
            key={meet.id}
            meet={meet}
            type="MAIN"
            onPress={() => {
              navigation.navigate('CommunityStack', {
                screen: 'MeetRecruit',
                params: {meetId: meet.id, communityId: meet.communityId},
              });
            }}
          />
        ))}
      </View>
    </>
  );
};

export default RecommendMeets;
