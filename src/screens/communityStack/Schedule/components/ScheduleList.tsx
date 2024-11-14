import React, {useState, useRef, useCallback, useMemo} from 'react';
import {
  View,
  FlatList,
  Dimensions,
  ListRenderItem,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {addMonths, subMonths} from 'date-fns';
import CustomText from 'components/common/CustomText';
import {useGetMatchSchedule} from 'apis/match/useMatches';
import {formatBarDate} from 'utils/format';
import CustomDay from './CustomDay';
import {Community} from 'apis/community/types';

interface YearMonth {
  year: number;
  month: number;
}

const {width} = Dimensions.get('window');

interface ScheduleListProps {
  community: Community;
}

const ScheduleList = ({community}: ScheduleListProps) => {
  const today = useMemo(() => new Date(), []);
  const [curMonth, setCurMonth] = useState<YearMonth>({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });
  const [months, setMonths] = useState<YearMonth[]>(() => {
    return [
      {
        year: subMonths(today, 2).getFullYear(),
        month: subMonths(today, 2).getMonth() + 1,
      },
      {
        year: subMonths(today, 1).getFullYear(),
        month: subMonths(today, 1).getMonth() + 1,
      },
      {year: today.getFullYear(), month: today.getMonth() + 1},
      {
        year: addMonths(today, 1).getFullYear(),
        month: addMonths(today, 1).getMonth() + 1,
      },
      {
        year: addMonths(today, 2).getFullYear(),
        month: addMonths(today, 2).getMonth() + 1,
      },
    ];
  });
  const flatListRef = useRef<FlatList>(null);

  const {data, isLoading} = useGetMatchSchedule(
    community.id,
    curMonth.year,
    curMonth.month,
  );

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

  const renderItem: ListRenderItem<YearMonth> = useCallback(
    ({item}) => {
      const weeks = generateCalendarData(item.year, item.month);

      return (
        <ScrollView style={{width: width}} className="">
          <View className="flex-row items-center justify-center py-1">
            {isLoading && <View className="w-5 h-5" />}
            <CustomText
              fontWeight="600"
              className="text-xl text-center text-slate-900 my-3 mx-2">
              {item.year === today.getFullYear()
                ? `${item.month}월`
                : `${item.year}년 ${item.month}월`}
            </CustomText>
            {isLoading && <ActivityIndicator />}
          </View>

          <View className="flex-row justify-around mt-1">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <CustomText
                key={index}
                fontWeight="500"
                className="text-gray-400 text-[15px]">
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
                    new Date(item.year, item.month - 1, day),
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
        </ScrollView>
      );
    },
    [community, data, generateCalendarData, isLoading, today],
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(offsetX / width);
    setCurMonth(months[currentIndex]);
    if (currentIndex === 0) {
      const currentOffset = offsetX;

      setMonths(prevMonths => {
        const firstMonth = prevMonths[0];
        const prevMonth = subMonths(
          new Date(firstMonth.year, firstMonth.month - 1),
          1,
        );
        return [
          {year: prevMonth.getFullYear(), month: prevMonth.getMonth() + 1},
          ...prevMonths,
        ];
      });

      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({
            offset: currentOffset + width,
            animated: false,
          });
        }
      }, 0);
    } else if (currentIndex === months.length - 1) {
      setMonths(prevMonths => {
        const lastMonth = prevMonths[prevMonths.length - 1];
        const nextMonth = addMonths(
          new Date(lastMonth.year, lastMonth.month - 1),
          1,
        );
        return [
          ...prevMonths,
          {year: nextMonth.getFullYear(), month: nextMonth.getMonth() + 1},
        ];
      });
    }
  };

  return (
    <FlatList
      ref={flatListRef}
      data={months}
      horizontal
      pagingEnabled
      keyExtractor={item => `${item.year}-${item.month}`}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={handleScroll}
      getItemLayout={(data, index) => ({
        length: width,
        offset: width * index,
        index,
      })}
      initialScrollIndex={2}
      windowSize={5}
    />
  );
};

export default ScheduleList;
