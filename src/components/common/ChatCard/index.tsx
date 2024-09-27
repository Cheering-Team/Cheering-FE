import React from 'react';
import {Pressable, View} from 'react-native';
import Avatar from '../Avatar';
import CustomText from '../CustomText';
import OfficialSvg from '../../../../assets/images/official.svg';
import {ChatRoom} from 'apis/chat/types';
import PersonSvg from '../../../../assets/images/person-gray.svg';
interface ChatCardProps {
  chatRoom: ChatRoom;
  onPress: () => void;
}

const ChatCard = (props: ChatCardProps) => {
  const {chatRoom, onPress} = props;

  return (
    <Pressable
      key={chatRoom.id}
      className="flex-row px-[15] py-[10]"
      onPress={onPress}>
      <Avatar uri={chatRoom.image} size={59} className="rounded-2xl mt-[3]" />
      <View className="ml-3">
        <View className="flex-row items-center">
          <CustomText fontWeight="500" className="text-base mr-[2] pb-0">
            {chatRoom.name}
          </CustomText>
          <OfficialSvg width={15} height={15} />
        </View>
        <CustomText className="color-[#8a8a8a]">
          {chatRoom.description}
        </CustomText>
        <View className="flex-row items-center">
          <PersonSvg width={10} height={10} />
          <CustomText
            fontWeight="600"
            className="color-[#777777] text-xs pb-0 ml-[3]">
            {`${chatRoom.count}`}
          </CustomText>
        </View>
      </View>
    </Pressable>
  );
};

export default ChatCard;
