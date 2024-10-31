import React, {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {CalendarList, DateData, LocaleConfig} from 'react-native-calendars';
import CustomDay from '../CustomDay';
import {DayProps} from 'react-native-calendars/src/calendar/day';
import {useGetMatchSchedule} from 'apis/match/useMatches';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {Community} from 'apis/community/types';

LocaleConfig.locales['ko'] = {
  monthNames: [
    '01월',
    '02월',
    '03월',
    '04월',
    '05월',
    '06월',
    '07월',
    '08월',
    '09월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

interface MatchScheduleProps {
  community: Community;
}

const MatchSchedule = ({community}: MatchScheduleProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const {data} = useGetMatchSchedule(community.id);

  const renderDayComponent = useCallback(
    ({
      date,
    }: DayProps & {
      date?: DateData;
    }) => {
      const dayKey = date?.dateString;
      const daySchedule = dayKey && data ? data[dayKey] : [];
      return (
        <TouchableOpacity
          className="w-full rounded-xl items-center"
          onPress={() => {
            if (daySchedule && daySchedule.length) {
              navigation.navigate('Match', {
                matchId: daySchedule[0].id,
                community,
              });
            }
          }}
          style={{
            backgroundColor:
              daySchedule && daySchedule.length && daySchedule[0].isHome
                ? 'rgb(226,232,240)'
                : 'none',
          }}>
          <CustomDay date={date} daySchedule={daySchedule} />
        </TouchableOpacity>
      );
    },
    [data],
  );

  return (
    <>
      <CalendarList
        pastScrollRange={12}
        futureScrollRange={6}
        calendarHeight={540}
        theme={{
          textMonthFontSize: 17,
          textMonthFontWeight: '500',
          textMonthFontFamily: 'Pretendard-Medium',
          monthTextColor: 'black',
          textDayHeaderFontSize: 12,
          textDayHeaderFontWeight: '500',
          textDayHeaderFontFamily: 'Pretendard-Medium',
          textSectionTitleColor: 'black',
          textDayFontSize: 15,
          textDayFontWeight: '600',
          textDayFontFamily: 'Pretendard-SemiBold',
          dayTextColor: 'rgb(146, 152, 163)',
        }}
        dayComponent={renderDayComponent}
      />
    </>
  );
};

export default memo(MatchSchedule);
