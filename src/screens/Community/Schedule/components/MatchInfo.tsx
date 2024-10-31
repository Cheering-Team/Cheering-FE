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
      <View className="items-center">
        <FastImage
          source={{uri: match?.awayTeam.image}}
          className="w-[80] h-[80]"
        />
        <CustomText fontWeight="500" className="text-base">
          {match?.awayTeam.koreanName.substring(
            0,
            match?.awayTeam.koreanName.lastIndexOf(' '),
          )}
        </CustomText>
      </View>
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
      <View className="items-center">
        <FastImage
          source={{uri: match?.homeTeam.image}}
          className="w-[80] h-[80]"
        />
        <CustomText fontWeight="500" className="text-base">
          {match?.homeTeam.koreanName.substring(
            0,
            match?.homeTeam.koreanName.lastIndexOf(' '),
          )}
        </CustomText>
      </View>
    </View>
  );
};

export default MatchInfo;
