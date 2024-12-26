import {Community} from 'apis/community/types';
import {MatchDetail} from 'apis/match/types';
import CustomText from 'components/common/CustomText';
import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {formatDate} from 'utils/format';

interface MatchInfoProps {
  match: MatchDetail;
  community: Community;
}

const MatchInfo = ({match, community}: MatchInfoProps) => {
  return (
    <View>
      <View className="py-[14] flex-row justify-around items-center">
        {match?.sportName === '야구' ? (
          <>
            <View className="items-center">
              <FastImage
                source={{uri: match?.awayTeam.image}}
                className="w-[80] h-[80]"
              />
              <CustomText fontWeight="500" className="text-base">
                {match?.awayTeam.shortName}
              </CustomText>
            </View>
            {match?.status !== 'not_started' ? (
              <View className="items-center">
                <CustomText
                  className="text-[33px] mt-4"
                  fontWeight="800">{`${match.awayScore} : ${match.homeScore}`}</CustomText>
                <CustomText fontWeight="600" className="text-[15px] mt-3">
                  {match?.time.substring(
                    match.time.indexOf('T') + 1,
                    match.time.lastIndexOf(':'),
                  )}
                </CustomText>
                <CustomText
                  fontWeight="500"
                  className="text-gray-600 text-[13px]">
                  {match?.location}
                </CustomText>
              </View>
            ) : (
              <View className="items-center">
                <CustomText fontWeight="600" className="mb-1 text-lg">
                  {match?.time.substring(
                    match.time.indexOf('T') + 1,
                    match.time.lastIndexOf(':'),
                  )}
                </CustomText>
                <CustomText fontWeight="500" className="text-gray-600">
                  {match?.location}
                </CustomText>
              </View>
            )}

            <View className="items-center">
              <FastImage
                source={{uri: match?.homeTeam.image}}
                className="w-[80] h-[80]"
              />
              <CustomText fontWeight="500" className="text-base">
                {match?.homeTeam.shortName}
              </CustomText>
            </View>
          </>
        ) : (
          <>
            <View className="items-center w-[100]">
              <FastImage
                source={{uri: match?.homeTeam.image}}
                className="w-[70] h-[70]"
              />
              <CustomText className="text-[15px]">
                {match?.homeTeam.shortName}
              </CustomText>
            </View>
            {match.status === 'not_started' && (
              <View className="items-center">
                <View className="bg-gray-400 px-2 py-[3] rounded-full mb-1 mt-2">
                  <CustomText
                    className="text-white text-[12px]"
                    fontWeight="500">
                    경기전
                  </CustomText>
                </View>
                <CustomText fontWeight="500" className="text-sm">
                  {formatDate(match.time)}
                </CustomText>
                <CustomText
                  fontWeight="400"
                  className="text-gray-600 text-[13px]">
                  {match?.location}
                </CustomText>
              </View>
            )}
            {match.status === 'live' && (
              <View className="items-center">
                <View className="bg-rose-600 px-2 py-[3] rounded-full mt-1">
                  <CustomText
                    className="text-white text-[12px]"
                    fontWeight="500">
                    LIVE
                  </CustomText>
                </View>
                <CustomText
                  className="text-3xl my-1"
                  fontWeight="900">{`${match.homeScore} : ${match.awayScore}`}</CustomText>

                <CustomText fontWeight="500" className="text-sm">
                  {formatDate(match.time)}
                </CustomText>
                <CustomText
                  fontWeight="400"
                  className="text-gray-600 text-[13px]">
                  {match?.location}
                </CustomText>
              </View>
            )}
            {match?.status === 'closed' && (
              <View className="items-center">
                <View className="bg-gray-700 px-2 py-[3] rounded-full mt-1">
                  <CustomText
                    className="text-white text-[12px]"
                    fontWeight="500">
                    경기종료
                  </CustomText>
                </View>
                <CustomText
                  className="text-3xl my-1"
                  fontWeight="900">{`${match.homeScore} : ${match.awayScore}`}</CustomText>

                <CustomText fontWeight="500" className="text-sm">
                  {formatDate(match.time)}
                </CustomText>
                <CustomText
                  fontWeight="400"
                  className="text-gray-600 text-[13px]">
                  {match?.location}
                </CustomText>
              </View>
            )}

            <View className="items-center w-[100]">
              <FastImage
                source={{uri: match?.awayTeam.image}}
                className="w-[70] h-[70]"
              />
              <CustomText fontWeight="400" className="text-[15px]">
                {match?.awayTeam.shortName}
              </CustomText>
            </View>
          </>
        )}
      </View>
      <View
        className="h-[30] mx-[6] rounded-[4px] mb-3 my-2 items-center flex-row justify-center"
        style={{backgroundColor: community.color}}>
        <FastImage source={{uri: community.image}} className="w-[25] h-[25]" />
        <CustomText
          className="text-white text-[13px] ml-[6]"
          fontWeight="500">{`${community.koreanName}를 위한 응원 공간이에요`}</CustomText>
      </View>
    </View>
  );
};

export default MatchInfo;
