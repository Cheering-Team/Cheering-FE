import {MatchDetail} from 'apis/match/types';
import CustomText from 'components/common/CustomText';
import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';

interface MatchInfoProps {
  match: MatchDetail;
}

const MatchInfo = ({match}: MatchInfoProps) => {
  return (
    <View className="flex-row justify-around items-center py-2">
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
              className="w-[80] h-[80]"
            />
            <CustomText fontWeight="500" className="text-base">
              {match?.homeTeam.shortName}
            </CustomText>
          </View>
          {match?.status !== 'not_started' ? (
            <View className="items-center">
              <CustomText
                className="text-[33px] mt-4"
                fontWeight="800">{`${match.homeScore} : ${match.awayScore}`}</CustomText>
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

          <View className="items-center w-[100]">
            <FastImage
              source={{uri: match?.awayTeam.image}}
              className="w-[80] h-[80]"
            />
            <CustomText fontWeight="500" className="text-base">
              {match?.awayTeam.shortName}
            </CustomText>
          </View>
        </>
      )}
    </View>
  );
};

export default MatchInfo;
