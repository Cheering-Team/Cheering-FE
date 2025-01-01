import {MatchDetail} from 'apis/match/types';
import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import CustomText from './CustomText';
import {formatMonthDayDay, formatTime} from 'utils/format';
import {WINDOW_WIDTH} from 'constants/dimension';

interface MatchInfoProps {
  match: MatchDetail;
  height?: number;
  width?: number;
  radius?: number;
}

const MatchInfo = ({
  match,
  height = 130,
  width = WINDOW_WIDTH,
  radius = 0,
}: MatchInfoProps) => {
  return (
    <View className="flex-row justify-center items-center" style={{height}}>
      <View
        className="flex-1 mr-[2] justify-center items-center overflow-hidden"
        style={{
          backgroundColor: `${match.homeTeam.color}`,
          width: width / 2 - 2,
          borderTopLeftRadius: radius,
          borderBottomLeftRadius: radius,
        }}>
        <FastImage
          source={{uri: match.homeTeam.image}}
          className="w-[180] opacity-40 mr-8"
          style={{height}}
        />
        <CustomText
          type="title"
          className="absolute text-white left-[6] bottom-0 text-lg w-[100]">
          {match.homeTeam.shortName}
        </CustomText>
        <View className="flex-row items-center absolute top-1 right-2">
          <CustomText className="text-white text-[13px] mr-1" fontWeight="500">
            {formatMonthDayDay(match.time)}
          </CustomText>
          <CustomText className="text-white text-[13px]" fontWeight="500">
            {formatTime(match.time)}
          </CustomText>
        </View>
        {match.status === 'live' ||
          (match.status === 'closed' && (
            <CustomText
              className="absolute text-white bottom-1 right-[10] text-4xl"
              fontWeight="900">
              {match.homeScore}
            </CustomText>
          ))}
      </View>

      <View
        className="flex-1 ml-[2] justify-center items-center overflow-hidden"
        style={{
          backgroundColor: `${match.awayTeam.color}`,
          width: width / 2 - 2,
          borderTopRightRadius: radius,
          borderBottomRightRadius: radius,
        }}>
        <FastImage
          source={{uri: match.awayTeam.image}}
          className="w-[180] opacity-40 ml-8"
          style={{height}}
        />
        <CustomText
          type="title"
          className="absolute text-white right-[6] bottom-0 text-lg w-[100] text-right">
          {match.awayTeam.shortName}
        </CustomText>
        <CustomText
          className="absolute text-white top-1 left-2 text-[13px]"
          fontWeight="500">
          {match.location}
        </CustomText>
        {match.status === 'live' ||
          (match.status === 'closed' && (
            <CustomText
              className="absolute text-white bottom-1 left-[10] text-4xl"
              fontWeight="900">
              {match.awayScore}
            </CustomText>
          ))}
      </View>
      <View className="absolute w-9 h-9 bg-white items-center justify-center rounded-full">
        <CustomText
          type="titleCenter"
          className="text-gray-700"
          style={{color: match.status === 'live' ? '#e61919' : '#374151'}}>
          {match.status === 'live' ? 'LIVE' : 'VS'}
        </CustomText>
      </View>
    </View>
  );
};

export default MatchInfo;
