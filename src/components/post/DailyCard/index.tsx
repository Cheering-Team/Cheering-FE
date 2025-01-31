import {Post} from 'apis/post/types';
import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import React from 'react';
import {Pressable} from 'react-native';
import OfficialSvg from 'assets/images/official.svg';
import {View} from 'react-native';
import {formatBarDate, formatMonthDay} from 'utils/format';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';

interface DailyCardProps {
  daily: Post;
}

const DailyCard = ({daily}: DailyCardProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  return (
    <Pressable
      className="bg-white px-4 py-3 h-[110] justify-between  rounded-xl mt-[10] border border-gray-200"
      onPress={() => {
        navigation.navigate('Daily', {
          communityId: daily.community.id,
          date: formatBarDate(new Date(daily.createdAt)),
          write: false,
          user: daily.user,
        });
      }}
      style={{
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
      }}>
      <View className="flex-row items-center">
        <Avatar uri={daily.writer.image} size={25} />
        <CustomText fontWeight="600" className="text-lg ml-2 mr-[3]">
          {daily.writer.name}
        </CustomText>
        {daily.writer.type === 'MANAGER' && (
          <OfficialSvg width={16} height={16} />
        )}
      </View>

      <CustomText
        numberOfLines={1}
        fontWeight="400"
        className="text-[#111111] text-lg">
        {daily.content}
      </CustomText>
      <View className="flex-row items-center justify-between">
        <CustomText className="text-gray-500 text-[15px]" fontWeight="500">
          {formatMonthDay(daily.createdAt)}
        </CustomText>

        <CustomText className="text-gray-800 ml-1 text-[15px]">
          {`답글 ${daily.commentCount}개`}
        </CustomText>
      </View>
    </Pressable>
  );
};

export default DailyCard;
