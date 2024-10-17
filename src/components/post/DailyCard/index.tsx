import {Post} from 'apis/post/types';
import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import {WINDOW_WIDTH} from 'constants/dimension';
import React from 'react';
import {Pressable} from 'react-native';
import OfficialSvg from 'assets/images/official.svg';
import {View} from 'react-native';
import {formatBarDate, formatMonthDay} from 'utils/format';
import {useNavigation} from '@react-navigation/native';

interface DailyCardProps {
  daily: Post;
}

const DailyCard = ({daily}: DailyCardProps) => {
  const navigation = useNavigation();
  return (
    <Pressable
      className="bg-neutral-50 rounded-2xl pt-6 pb-3 px-5 mx-3"
      onPress={() =>
        navigation.navigate('Daily', {
          playerId: daily.player.id,
          date: formatBarDate(new Date(daily.createdAt)),
        })
      }
      style={{
        width: WINDOW_WIDTH * 0.7,
        shadowColor: '#8b8b8b',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 8,
        elevation: 7,
      }}>
      <Avatar
        uri={daily.writer.image}
        size={45}
        className="absolute left-5 top-[-25]"
      />
      <View className="flex-row items-center">
        <CustomText fontWeight="600" className="text-base mr-[2]">
          {daily.writer.nickname}
        </CustomText>
        {daily.writer.isOwner && <OfficialSvg width={14} height={14} />}
      </View>

      <CustomText
        numberOfLines={2}
        fontWeight="400"
        className="text-[#111111] text-[15px] mt-1 flex-1">
        {daily.content}
      </CustomText>
      <View className="flex-row items-center justify-between">
        <CustomText className="text-gray-500 text-[13px]" fontWeight="500">
          {formatMonthDay(daily.createdAt)}
        </CustomText>

        <CustomText className="text-gray-800 ml-1 text-[13px]">
          {`답글 ${daily.commentCount}개`}
        </CustomText>
      </View>
    </Pressable>
  );
};

export default DailyCard;
