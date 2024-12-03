import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Community} from 'apis/community/types';
import {MatchSchedule} from 'apis/match/types';
import CustomText from 'components/common/CustomText';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {memo} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {formatBarDate} from 'utils/format';

const {width} = Dimensions.get('window');

interface CustomDayProps {
  data?: MatchSchedule;
  dateString: string;
  day: number | null;
  community: Community;
}

const CustomDay = ({data, dateString, day, community}: CustomDayProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  return (
    <View
      className="items-center rounded-lg"
      style={{
        width: width / 7,
      }}>
      <CustomText
        className="text-base mt-3 mb-[1]"
        style={{
          color:
            data && data[dateString]
              ? 'black'
              : formatBarDate(new Date()) === dateString
                ? 'black'
                : '#b5b5b5',
        }}
        fontWeight={formatBarDate(new Date()) === dateString ? '600' : '500'}>
        {day ? (formatBarDate(new Date()) === dateString ? '오늘' : day) : ''}
      </CustomText>

      {data && data[dateString] ? (
        data[dateString].map(match => (
          <TouchableOpacity
            activeOpacity={0.3}
            onPress={() => {
              navigation.navigate('Match', {
                matchId: match.id,
                communityId: community.id,
              });
            }}
            key={match.id}
            className="rounded-lg"
            style={{
              backgroundColor: match.isHome ? `${community.color}70` : 'white',
              borderWidth: match.isHome ? 1 : 0,
              borderColor: community.color,
            }}>
            <FastImage
              source={{uri: match.opponentImage}}
              className="h-[45] w-[45]"
            />
          </TouchableOpacity>
        ))
      ) : (
        <View className="w-[45] h-[45]" />
      )}
    </View>
  );
};

export default memo(CustomDay);
