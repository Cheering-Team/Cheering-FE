import {Post} from 'apis/post/types';
import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import React from 'react';
import {Pressable} from 'react-native';

interface DailyCardProps {
  daily: Post;
}

const DailyCard = ({daily}: DailyCardProps) => {
  return (
    <Pressable className="bg-white w-[200]">
      <Avatar uri={daily.writer.image} size={40} />
      <CustomText>{daily.content}</CustomText>
    </Pressable>
  );
};

export default DailyCard;
