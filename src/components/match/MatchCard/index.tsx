import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Community} from 'apis/community/types';
import {MatchDetail} from 'apis/match/types';
import CustomText from 'components/common/CustomText';
import {WINDOW_WIDTH} from 'constants/dimension';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import React from 'react';
import {Pressable, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {formatDOW, formatTime, formatTodayOrDate} from 'utils/format';

interface MatchCardProps {
  match: MatchDetail;
  community?: Community;
  onPress: () => void;
  liveOnPress: () => void;
}

const MatchCard = ({
  match,
  community,
  onPress,
  liveOnPress,
}: MatchCardProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  return (
    <View
      style={{
        width: community ? WINDOW_WIDTH * 0.67 : undefined,
        marginHorizontal: community ? 4 : undefined,
        marginBottom: community ? undefined : 8,
      }}>
      <Pressable
        onPress={onPress}
        className="bg-white py-[9] px-2 rounded-lg shadow-sm shadow-gray-100"
        style={{
          borderWidth: 1,
          borderColor:
            formatTodayOrDate(match.time) === '오늘' && community
              ? community.color
              : '#e5e7eb',
        }}>
        <View
          className="flex-row items-center justify-between"
          style={{
            opacity: match.status === 'closed' ? 0.5 : 1,
            paddingHorizontal: community ? undefined : 6,
          }}>
          {community && (
            <View className="flex-row items-center">
              {formatTodayOrDate(match.time) !== '오늘' ? (
                <CustomText className="text-gray-900">
                  {formatTodayOrDate(match.time)}
                </CustomText>
              ) : (
                <CustomText className="text-[15px]" fontWeight="600">
                  오늘
                </CustomText>
              )}

              {formatTodayOrDate(match.time) !== '오늘' && (
                <CustomText fontWeight="600" className="ml-1">
                  {formatDOW(match.time)}
                </CustomText>
              )}
            </View>
          )}
          {match.status === 'closed' && <CustomText>경기종료</CustomText>}
          {match.status === 'not_started' && (
            <CustomText fontWeight="500">{formatTime(match.time)}</CustomText>
          )}
        </View>
        <View
          className="flex-row items-center mt-4 rounded-sm pl-1 pr-2"
          style={{
            opacity: match.status === 'closed' ? 0.5 : 1,
            marginTop: community ? 16 : 4,
          }}>
          <View className="flex-1 flex-row items-center">
            <FastImage
              source={{uri: match.homeTeam.image}}
              className="w-[30] h-[30]"
            />
            <CustomText
              className="ml-1 text-[13px]"
              fontWeight={
                community &&
                (match.homeTeam.id === community.id ||
                  match.homeTeam.koreanName === community.firstTeamName)
                  ? '500'
                  : '400'
              }
              style={{
                color:
                  community &&
                  (match.homeTeam.id === community.id ||
                    match.homeTeam.koreanName === community.firstTeamName)
                    ? community.color
                    : '#232323',
              }}>
              {match.homeTeam.shortName}
            </CustomText>
            <View
              className="justify-center items-center rounded-[3px] ml-1 p-[2]"
              style={{backgroundColor: match.homeTeam.color}}>
              <CustomText fontWeight="600" className="text-[11px] text-white">
                홈
              </CustomText>
            </View>
          </View>

          <CustomText>{match.homeScore}</CustomText>
        </View>
        <View
          className="flex-row items-center rounded-sm pl-1 pr-2"
          style={{opacity: match.status === 'closed' ? 0.5 : 1}}>
          <FastImage
            source={{uri: match.awayTeam.image}}
            className="w-[30] h-[30]"
          />
          <CustomText
            className="ml-1 text-[13px] flex-1"
            fontWeight={
              community &&
              (match.awayTeam.id === community.id ||
                match.awayTeam.koreanName === community.firstTeamName)
                ? '500'
                : '400'
            }
            style={{
              color:
                community &&
                (match.awayTeam.id === community.id ||
                  match.awayTeam.koreanName === community.firstTeamName)
                  ? community.color
                  : '#232323',
            }}>
            {match.awayTeam.shortName}
          </CustomText>
          <CustomText>{match.awayScore}</CustomText>
        </View>
        {match.status === 'not_started' && (
          <View className="mt-1 border-t border-gray-100 pt-2">
            <View className="justify-center items-center">
              <CustomText>응원하기</CustomText>
            </View>
          </View>
        )}
        {match.status === 'live' && (
          <View className="mt-1 border-t border-gray-100 pt-2">
            <Pressable
              className="justify-center items-center"
              onPress={liveOnPress}>
              <CustomText className="text-rose-600" fontWeight="500">
                실시간 응원
              </CustomText>
            </Pressable>
          </View>
        )}
        {match.status === 'closed' && (
          <View className="mt-1 flex-row border-t border-gray-100 pt-2">
            <Pressable className="justify-center items-center flex-1">
              <CustomText
                style={{color: community?.color || 'black'}}
                fontWeight="500">
                MVP 투표
              </CustomText>
            </Pressable>
            <View className="w-[1] h-full bg-gray-100" />
            <Pressable className="justify-center items-center flex-1">
              <CustomText>공유하기</CustomText>
            </Pressable>
          </View>
        )}
      </Pressable>
      {match.meet && community && (
        <Pressable
          onPress={() => {
            if (match.meet) {
              if (
                match.meet.status === null ||
                match.meet.status === 'APPLIED'
              ) {
                navigation.navigate('MeetRecruit', {
                  meetId: match.meet.id,
                  communityId: community.id,
                });
              } else {
                navigation.navigate('Meet', {
                  meetId: match.meet.id,
                  communityId: community.id,
                });
              }
            }
          }}
          className="bg-white mt-1 py-[9] px-2 rounded-lg shadow-sm shadow-gray-200"
          style={{
            borderWidth: 1,
            borderColor:
              formatTodayOrDate(match.time) === '오늘'
                ? community.color
                : '#eeeeee',
          }}>
          {match.meet.status === null ? (
            <CustomText
              className="text-[13px] text-gray-500 mb-1 ml-[2]"
              fontWeight="500">
              추천 모임
            </CustomText>
          ) : (
            <CustomText
              className="text-[13px] mb-1 ml-[2]"
              style={{color: community.color}}
              fontWeight="500">
              예정된 모임
            </CustomText>
          )}
          <View className="flex-row items-center">
            {match.meet.type === 'LIVE' && (
              <CustomText
                className="text-[13px] text-gray-500 mr-[3] ml-[1]"
                fontWeight="600">
                {`[직관]`}
              </CustomText>
            )}
            {match.meet.type === 'BOOKING' && (
              <CustomText
                className="text-[13px] text-gray-500 mr-[3] ml-[1]"
                fontWeight="600">
                {`[모관]`}
              </CustomText>
            )}
            <CustomText className="text-[14px] flex-1" fontWeight="500">
              {match.meet?.title}
            </CustomText>
          </View>
        </Pressable>
      )}
    </View>
  );
};

export default MatchCard;
