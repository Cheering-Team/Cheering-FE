import {Match} from 'apis/match/types';
import CustomText from 'components/common/CustomText';
import React, {memo} from 'react';
import {View} from 'react-native';
import {DateData} from 'react-native-calendars';
import FastImage from 'react-native-fast-image';
import {formatBarDate} from 'utils/format';

interface CustomDayProps {
  date: (string & DateData) | undefined;
  daySchedule?: Match[];
}

const CustomDay = ({date, daySchedule}: CustomDayProps) => {
  return (
    <>
      <View
        style={
          date?.dateString === formatBarDate(new Date()) && {
            backgroundColor: '#ff7c7c',
            borderRadius: 100,
          }
        }>
        <CustomText
          fontWeight="500"
          className="text-slate-800 text-[14px] textslate">
          {date?.day}
        </CustomText>
      </View>

      {daySchedule?.length ? (
        daySchedule.map(schedule => (
          <FastImage
            key={schedule.id}
            source={{
              uri: schedule.opponentImage,
            }}
            className="w-[50] h-[50]"
          />
        ))
      ) : (
        <View className="h-[50]" />
      )}
    </>
  );
};

export default memo(
  CustomDay,
  (prevProp, nextProp) => prevProp.date === nextProp.date,
);
