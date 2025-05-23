import {MeetInfo} from 'apis/meet/types';
import CustomText from 'components/common/CustomText';
import React from 'react';
import {Pressable, View} from 'react-native';
import LocationSvg from 'assets/images/location-slate.svg';
import PersonSvg from 'assets/images/person-slate.svg';
import TicketSvg from 'assets/images/ticket-white.svg';
import FastImage from 'react-native-fast-image';
import {formatMonthDayDay} from 'utils/format';

interface MeetCardProps {
  meet: MeetInfo;
  type?: 'MY' | 'TAB' | 'MAIN';
  onPress: () => void;
}

const MeetCard = ({meet, type = 'TAB', onPress}: MeetCardProps) => {
  return (
    <Pressable
      className="flex-row my-1 border border-gray-200 bg-white rounded-lg overflow-hidden shadow-sm shadow-gray-100"
      style={{height: 90}}
      onPress={onPress}>
      <View className="flex-1 px-[10] py-2 justify-between">
        <View>
          <View className="flex-row items-center">
            {(type === 'MY' || type === 'MAIN') && (
              <>
                {meet.type === 'LIVE' && (
                  <CustomText
                    className="text-[14px] text-gray-500 mr-[2]"
                    fontWeight="600">
                    {`[직관]`}
                  </CustomText>
                )}
                {meet.type === 'BOOKING' && (
                  <CustomText
                    className="text-[14px] text-gray-500 mr-[2]"
                    fontWeight="600">
                    {`[모관]`}
                  </CustomText>
                )}
              </>
            )}
            <CustomText className="text-[15px] flex-1" fontWeight="500">
              {meet.title}
            </CustomText>
          </View>
          <CustomText className="text-[14px] mt-[3] text-gray-700">
            {meet.description}
          </CustomText>
        </View>

        <View className="flex-row items-center justify-between">
          {type === 'MY' ? (
            <View className="flex-row items-center">
              {meet.status === 'MANAGER' && (
                <View className="bg-green-600 px-[5] py-[2] rounded-[4px]">
                  <CustomText
                    className="text-white text-[13px]"
                    fontWeight="500">
                    모임장
                  </CustomText>
                </View>
              )}
              {meet.status === 'CONFIRMED' && (
                <View className="bg-black px-[5] py-[2] rounded-[4px]">
                  <CustomText
                    className="text-white text-[13px]"
                    fontWeight="500">
                    멤버
                  </CustomText>
                </View>
              )}
              {meet.status === 'APPLIED' && (
                <View className="bg-gray-500 px-[5] py-[2] rounded-[4px]">
                  <CustomText
                    className="text-white text-[13px]"
                    fontWeight="500">
                    대화중
                  </CustomText>
                </View>
              )}
            </View>
          ) : (
            <View className="flex-row items-center flex-1">
              <CustomText className="text-[13px] text-[#5d6674]">{`${meet.ageMin}~${meet.ageMax}세`}</CustomText>
              <View className="w-[1] h-3 bg-slate-400 mx-1" />
              <CustomText className="text-[13px] text-[#5d6674]">
                {meet.gender === 'MALE' && '남자'}
                {meet.gender === 'ANY' && '성별 무관'}
                {meet.gender === 'FEMALE' && '여자'}
              </CustomText>
              {meet.type === 'BOOKING' && (
                <>
                  <View className="w-[1] h-3 bg-slate-400 mx-1" />
                  <View className="flex-row items-center flex-1 mr-3">
                    <LocationSvg />
                    <CustomText className="text-[13px] text-[#5d6674] ml-[1]">
                      {meet.place}
                    </CustomText>
                  </View>
                </>
              )}
            </View>
          )}

          <View className="flex-row items-center">
            <PersonSvg width={11} height={11} />
            <CustomText className="text-[13px] ml-[2] text-[#5d6674]">{`${meet.currentCount}`}</CustomText>
            <CustomText className="text-[13px] mx-[2] text-[#5d6674]">{`/`}</CustomText>
            <CustomText className="text-[13px] text-[#5d6674]">{`${meet.max}`}</CustomText>
          </View>
        </View>
      </View>
      <View
        className="items-center justify-end w-[90] px-1 pb-[6]"
        style={{backgroundColor: `${meet.match.opponentColor}E0`}}>
        {meet.type === 'LIVE' && meet.hasTicket && (
          <TicketSvg
            width={22}
            height={22}
            className="absolute top-[1] right-[3] z-50"
          />
        )}

        <FastImage
          source={{uri: meet.match.opponentImage}}
          className="w-[40] h-[40]"
        />
        <CustomText className="text-white mt-[1] text-[12px]" fontWeight="500">
          {`vs ${meet.match.opponentShortName}`}
        </CustomText>
        <CustomText
          className="text-[#f0f0f0] mt-[1] text-[11.5px]"
          fontWeight="500">
          {formatMonthDayDay(meet.match.time)}
        </CustomText>
      </View>
    </Pressable>
  );
};

export default MeetCard;
