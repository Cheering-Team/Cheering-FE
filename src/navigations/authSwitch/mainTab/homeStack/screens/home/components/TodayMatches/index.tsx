import {useGetMatchesByDate} from 'apis/match/useMatches';
import CustomText from 'components/common/CustomText';
import MatchInfo from 'components/common/MatchInfo';
import React from 'react';
import {Pressable, View} from 'react-native';

const TodayMatches = () => {
  const today = new Date();

  const {data: matches} = useGetMatchesByDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );

  return (
    <>
      <CustomText className="text-lg mt-6 mb-2 ml-[14]" fontWeight="500">
        오늘의 경기 일정
      </CustomText>
      <View className="mx-[14]">
        {matches?.map(match => {
          return (
            <Pressable className="my-[2]">
              <MatchInfo match={match} radius={3} height={80} />
            </Pressable>
          );
        })}
      </View>
    </>
  );
};

export default TodayMatches;
