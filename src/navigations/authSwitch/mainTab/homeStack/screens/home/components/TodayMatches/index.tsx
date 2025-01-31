import {useGetMatchesByDate} from 'apis/match/useMatches';
import CustomText from 'components/common/CustomText';
import MatchCard from 'components/match/MatchCard';
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
      <CustomText className="text-[18px] mt-8 mb-3 ml-4" fontWeight="500">
        오늘 우리팀 경기
      </CustomText>
      <View className="mx-[14]">
        {matches?.map(match => {
          return (
            <MatchCard
              key={match.id}
              match={match}
              onPress={() => {
                //
              }}
              liveOnPress={() => {
                //
              }}
            />
          );
        })}
        {matches?.length === 0 && (
          <Pressable
            className="bg-white py-[9] px-2 rounded-lg shadow-sm shadow-gray-100 justify-center items-center h-[110]"
            style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
            }}>
            <CustomText className="text-slate-700 text-[14px]">
              오늘 하루는 심심할지도..
            </CustomText>
          </Pressable>
        )}
      </View>
    </>
  );
};

export default TodayMatches;
