import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Community} from 'apis/community/types';
import {MatchDetail} from 'apis/match/types';
import CustomText from 'components/common/CustomText';
import {WINDOW_WIDTH} from 'constants/dimension';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import React, {useEffect, useRef} from 'react';
import {FlatList, ListRenderItem, Pressable, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {formatDOW, formatTime, formatTodayOrDate} from 'utils/format';

interface MatchListProps {
  community: Community;
  onTabPress: (index: number) => void;
  matches: MatchDetail[] | undefined;
}

const MatchList = ({community, onTabPress, matches}: MatchListProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const matchRef = useRef<FlatList | null>(null);

  const renderItem: ListRenderItem<MatchDetail> = ({item}) => {
    return (
      <View style={{width: WINDOW_WIDTH * 0.67, marginHorizontal: 4}}>
        <Pressable
          onPress={() => {
            navigation.navigate('Match', {
              matchId: item.id,
              communityId: community.id,
            });
          }}
          className="bg-white py-[9] px-2 rounded-lg shadow-sm shadow-gray-100"
          style={{
            borderWidth: 1,
            borderColor:
              formatTodayOrDate(item.time) === '오늘'
                ? community.color
                : '#eeeeee',
          }}>
          <View
            className="flex-row items-center justify-between"
            style={{opacity: item.status === 'closed' ? 0.5 : 1}}>
            <View className="flex-row items-center">
              {formatTodayOrDate(item.time) !== '오늘' ? (
                <CustomText className="text-gray-900">
                  {formatTodayOrDate(item.time)}
                </CustomText>
              ) : (
                <CustomText className="text-[15px]" fontWeight="600">
                  오늘
                </CustomText>
              )}

              {formatTodayOrDate(item.time) !== '오늘' && (
                <CustomText fontWeight="600" className="ml-1">
                  {formatDOW(item.time)}
                </CustomText>
              )}
            </View>
            {item.status === 'closed' && <CustomText>경기종료</CustomText>}
            {item.status === 'not_started' && (
              <CustomText fontWeight="500">{formatTime(item.time)}</CustomText>
            )}
          </View>
          <View
            className="flex-row items-center mt-4 rounded-sm pl-1 pr-2"
            style={{opacity: item.status === 'closed' ? 0.5 : 1}}>
            <View className="flex-1 flex-row items-center">
              <FastImage
                source={{uri: item.homeTeam.image}}
                className="w-[30] h-[30]"
              />
              <CustomText
                className="ml-1 text-[13px]"
                fontWeight={
                  item.homeTeam.id === community.id ||
                  item.homeTeam.koreanName === community.firstTeamName
                    ? '500'
                    : '400'
                }
                style={{
                  color:
                    item.homeTeam.id === community.id ||
                    item.homeTeam.koreanName === community.firstTeamName
                      ? community.color
                      : '#232323',
                }}>
                {item.homeTeam.shortName}
              </CustomText>
              <View
                className="justify-center items-center rounded-[3px] ml-1 p-[2]"
                style={{backgroundColor: item.homeTeam.color}}>
                <CustomText fontWeight="600" className="text-[11px] text-white">
                  홈
                </CustomText>
              </View>
            </View>

            <CustomText>{item.homeScore}</CustomText>
          </View>
          <View
            className="flex-row items-center rounded-sm pl-1 pr-2"
            style={{opacity: item.status === 'closed' ? 0.5 : 1}}>
            <FastImage
              source={{uri: item.awayTeam.image}}
              className="w-[30] h-[30]"
            />
            <CustomText
              className="ml-1 text-[13px] flex-1"
              fontWeight={
                item.awayTeam.id === community.id ||
                item.awayTeam.koreanName === community.firstTeamName
                  ? '500'
                  : '400'
              }
              style={{
                color:
                  item.awayTeam.id === community.id ||
                  item.awayTeam.koreanName === community.firstTeamName
                    ? community.color
                    : '#232323',
              }}>
              {item.awayTeam.shortName}
            </CustomText>
            <CustomText>{item.awayScore}</CustomText>
          </View>
          {item.status === 'not_started' && (
            <View className="mt-1 border-t border-gray-100 pt-2">
              <View className="justify-center items-center">
                <CustomText>응원하기</CustomText>
              </View>
            </View>
          )}
          {item.status === 'live' && (
            <View className="mt-1 border-t border-gray-100 pt-2">
              <Pressable
                className="justify-center items-center"
                onPress={() => {
                  if (community.officialRoomId) {
                    navigation.navigate('ChatRoom', {
                      chatRoomId: community.officialRoomId,
                      type: 'OFFICIAL',
                    });
                  }
                }}>
                <CustomText className="text-rose-600" fontWeight="500">
                  실시간 응원
                </CustomText>
              </Pressable>
            </View>
          )}
          {item.status === 'closed' && (
            <View className="mt-1 flex-row border-t border-gray-100 pt-2">
              <Pressable className="justify-center items-center flex-1">
                <CustomText style={{color: community.color}} fontWeight="500">
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
        {item.meet && (
          <Pressable
            onPress={() => {
              if (item.meet) {
                if (
                  item.meet.status === null ||
                  item.meet.status === 'APPLIED'
                ) {
                  navigation.navigate('MeetRecruit', {
                    meetId: item.meet.id,
                    community,
                  });
                } else {
                  navigation.navigate('Meet', {
                    meetId: item.meet.id,
                    communityId: community.id,
                  });
                }
              }
            }}
            className="bg-white mt-1 py-[9] px-2 rounded-lg shadow-sm shadow-gray-200"
            style={{
              borderWidth: 1,
              borderColor:
                formatTodayOrDate(item.time) === '오늘'
                  ? community.color
                  : '#eeeeee',
            }}>
            {item.meet.status === null ? (
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
              {item.meet.type === 'LIVE' && (
                <CustomText
                  className="text-[13px] text-gray-500 mr-[3] ml-[1]"
                  fontWeight="600">
                  {`[직관]`}
                </CustomText>
              )}
              {item.meet.type === 'BOOKING' && (
                <CustomText
                  className="text-[13px] text-gray-500 mr-[3] ml-[1]"
                  fontWeight="600">
                  {`[모관]`}
                </CustomText>
              )}
              <CustomText className="text-[14px] flex-1" fontWeight="500">
                {item.meet?.title}
              </CustomText>
            </View>
          </Pressable>
        )}
      </View>
    );
  };

  useEffect(() => {
    if (matches) {
      const index = matches.findIndex(match => {
        const matchDate = new Date(match.time);
        const now = new Date();

        const matchStart = new Date(
          matchDate.getFullYear(),
          matchDate.getMonth(),
          matchDate.getDate(),
        );

        const todayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );

        return matchStart >= todayStart;
      });
      matchRef.current?.scrollToOffset({
        offset: (WINDOW_WIDTH * 0.67 + 8) * index,
        animated: false,
      });
    }
  }, [matches]);

  if (!matches) {
    return null;
  }

  return (
    <View className="mt-3">
      <View className="flex-row justify-between items-center px-[14] mb-2">
        <View className="flex-row items-center">
          <CustomText className="text-lg" fontWeight="500">
            일정
          </CustomText>
          <View className="w-[3] h-[3] bg-black rounded-full mx-[3]" />
          <CustomText className="text-lg" fontWeight="500">
            결과
          </CustomText>
        </View>

        <Pressable
          className="border-b border-b-gray-600"
          onPress={() => onTabPress(3)}>
          <CustomText className="text-gray-600 text-[13px]">
            전체보기
          </CustomText>
        </Pressable>
      </View>
      {matches.length > 0 ? (
        <FlatList
          ref={matchRef}
          horizontal
          data={matches}
          snapToInterval={WINDOW_WIDTH * 0.67 + 8}
          decelerationRate={'fast'}
          contentContainerStyle={{
            paddingLeft: 13,
            paddingRight: 8,
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
        />
      ) : (
        <View className="justify-center items-center h-[80]">
          <CustomText className="text-slate-700">
            최근 일주일 전/후 경기가 없습니다
          </CustomText>
        </View>
      )}
    </View>
  );
};

export default MatchList;
