import {Community} from 'apis/community/types';
import {useGetMatchSchedule} from 'apis/match/useMatches';
import CustomText from 'components/common/CustomText';
import {WINDOW_HEIGHT} from 'constants/dimension';
import {useMainTabScroll} from 'context/useMainTabScroll';
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {FlatList, Pressable, ScrollView, View} from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomDay from 'screens/communityStack/schedule/components/CustomDay';
import {formatBarDate} from 'utils/format';
import LeftSvg from 'assets/images/calendar-left.svg';
import RightSvg from 'assets/images/calendar-right.svg';
import {queryClient} from '../../../../../App';
import {matchKeys} from 'apis/match/queries';
import {getMatchSchedule} from 'apis/match';

interface YearMonth {
  year: number;
  month: number;
}

interface ScheduleTabProps {
  scrollY: SharedValue<number>;
  isTabFocused: boolean;
  onMomentumScrollBegin: () => void;
  onMomentumScrollEnd: () => void;
  onScrollEndDrag: () => void;
  listArrRef: MutableRefObject<
    {
      key: string;
      value: FlatList<any> | ScrollView | null;
    }[]
  >;
  tabRoute: {
    key: string;
    title: string;
  };
  community: Community;
}

const ScheduleTab = ({
  scrollY,
  isTabFocused,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  onScrollEndDrag,
  listArrRef,
  tabRoute,
  community,
}: ScheduleTabProps) => {
  const {scrollY: tabScrollY, previousScrollY} = useMainTabScroll();
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 110 + insets.top;

  const today = useMemo(() => new Date(), []);
  const [curMonth, setCurMonth] = useState<YearMonth>({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  const {data} = useGetMatchSchedule(
    community.id,
    curMonth.year,
    curMonth.month,
  );

  const scrollHandler = useAnimatedScrollHandler(event => {
    const currentScrollY = event.contentOffset.y;
    if (isTabFocused) {
      scrollY.value = currentScrollY;
    }

    if (currentScrollY > previousScrollY.value + 2 && currentScrollY > 0) {
      tabScrollY.value = withTiming(50);
    } else if (
      currentScrollY < previousScrollY.value - 2 &&
      currentScrollY > 0
    ) {
      tabScrollY.value = withTiming(0);
    }
    previousScrollY.value = currentScrollY;
  });

  const getDaysInMonth = useCallback((year: number, month: number) => {
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const lastDateOfMonth = new Date(year, month, 0).getDate();

    return {firstDayOfMonth, lastDateOfMonth};
  }, []);

  const generateCalendarData = useCallback(
    (year: number, month: number) => {
      const {firstDayOfMonth, lastDateOfMonth} = getDaysInMonth(year, month);
      const weeks = [];
      let week = Array(firstDayOfMonth).fill(null);

      for (let day = 1; day <= lastDateOfMonth; day++) {
        week.push(day);

        if (week.length === 7 || day === lastDateOfMonth) {
          if (day === lastDateOfMonth && week.length < 7) {
            week = [...week, ...Array(7 - week.length).fill(null)];
          }
          weeks.push(week);
          week = [];
        }
      }

      return weeks;
    },
    [getDaysInMonth],
  );

  const weeks = generateCalendarData(curMonth.year, curMonth.month);

  useEffect(() => {
    const prefetchData = async (year: number, month: number) => {
      await queryClient.prefetchQuery({
        queryKey: matchKeys.list(community.id, year, month),
        queryFn: getMatchSchedule,
        retry: false,
      });
    };

    const prevMonth = curMonth.month === 1 ? 12 : curMonth.month - 1;
    const nextMonth = curMonth.month === 12 ? 1 : curMonth.month + 1;
    const prevYear = curMonth.month === 1 ? curMonth.year - 1 : curMonth.year;
    const nextYear = curMonth.month === 12 ? curMonth.year + 1 : curMonth.year;

    prefetchData(prevYear, prevMonth);
    prefetchData(nextYear, nextMonth);
  }, [community.id, curMonth]);

  return (
    <Animated.ScrollView
      ref={ref => {
        const foundIndex = listArrRef.current.findIndex(
          e => e.key === tabRoute.key,
        );

        if (foundIndex === -1) {
          listArrRef.current.push({
            key: tabRoute.key,
            value: ref,
          });
        } else {
          listArrRef.current[foundIndex] = {
            key: tabRoute.key,
            value: ref,
          };
        }
      }}
      scrollEventThrottle={16}
      onScroll={scrollHandler}
      scrollIndicatorInsets={{
        top: 110 + insets.top,
      }}
      onMomentumScrollBegin={onMomentumScrollBegin}
      onMomentumScrollEnd={onMomentumScrollEnd}
      onScrollEndDrag={onScrollEndDrag}
      contentContainerStyle={{
        backgroundColor: '#F5F4F5',
        paddingTop: HEADER_HEIGHT,
        minHeight: WINDOW_HEIGHT + HEADER_HEIGHT - 40,
      }}
      className="w-full">
      <View className="flex-row items-center justify-between">
        <Pressable
          className="p-4"
          onPress={() => {
            setCurMonth(prev => {
              if (prev.month === 1) {
                return {
                  year: prev.year - 1,
                  month: 12,
                };
              } else {
                return {
                  year: prev.year,
                  month: prev.month - 1,
                };
              }
            });
          }}>
          <LeftSvg width={18} height={18} />
        </Pressable>
        <View className="w-[40]" />
        <CustomText
          fontWeight="500"
          className="text-lg text-center text-slate-900 my-3">
          {curMonth.year === today.getFullYear()
            ? `${curMonth.month}월`
            : `${curMonth.year}년 ${curMonth.month}월`}
        </CustomText>
        <View className="flex-row items-center w-[40]">
          <View
            className="w-4 h-4 rounded-sm mr-1 border"
            style={{
              backgroundColor: `${community.color}40`,
              borderColor: `${community.color}60`,
            }}
          />
          <CustomText className="text-[13px] text-gray-900" fontWeight="500">
            홈경기
          </CustomText>
        </View>

        <Pressable
          className="p-4"
          onPress={() => {
            setCurMonth(prev => {
              if (prev.month === 12) {
                return {
                  year: prev.year + 1,
                  month: 1,
                };
              } else {
                return {
                  year: prev.year,
                  month: prev.month + 1,
                };
              }
            });
          }}>
          <RightSvg width={18} height={18} />
        </Pressable>
      </View>

      <View className="flex-row justify-around mt-1 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <CustomText
            key={index}
            fontWeight="500"
            className="text-gray-400 text-[14px]">
            {day}
          </CustomText>
        ))}
      </View>
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} className="flex-row">
          {week.map((day, dayIndex) => {
            let dateString = '';
            if (day) {
              dateString = formatBarDate(
                new Date(curMonth.year, curMonth.month - 1, day),
              );
            }
            return (
              <CustomDay
                key={dayIndex}
                data={data}
                dateString={dateString}
                day={day}
                community={community}
              />
            );
          })}
        </View>
      ))}
    </Animated.ScrollView>
  );
};

export default ScheduleTab;
