import React from 'react';
import {Pressable, View} from 'react-native';
import Avatar from '../Avatar';
import CustomText from '../CustomText';
import {ChatRoom} from 'apis/chat/types';
interface ChatCardProps {
  chatRoom: ChatRoom;
  onPress: () => void;
}

const ChatCard = (props: ChatCardProps) => {
  const {chatRoom, onPress} = props;

  return (
    <Pressable
      key={chatRoom.id}
      className="flex-row px-[15] py-[7]"
      onPress={onPress}>
      <Avatar uri={chatRoom.image} size={59} className="rounded-2xl mt-[3]" />
      <View className="ml-3 flex-1 justify-between">
        <View className="flex-row items-center">
          <CustomText
            fontWeight="500"
            className="text-base pb-0"
            numberOfLines={1}
            ellipsizeMode="tail">
            {chatRoom.name}
          </CustomText>
        </View>
        <CustomText
          className="color-[#8a8a8a]"
          numberOfLines={1}
          ellipsizeMode="tail">
          {chatRoom.description}
        </CustomText>
        <View className="flex-row items-center mt-[3]">
          {chatRoom.type === 'OFFICIAL' ? (
            <>
              <CustomText
                fontWeight="700"
                className="color-[#767676] text-xs pb-0">
                {`${chatRoom.count}`}
              </CustomText>
              <CustomText
                fontWeight="400"
                className="color-[#767676] text-xs pb-0 ml-[3]">
                {`명 참여중`}
              </CustomText>
            </>
          ) : (
            <>
              <CustomText
                fontWeight="700"
                className="color-[#767676] text-xs pb-0">
                {`${chatRoom.count}`}
              </CustomText>
              <CustomText
                fontWeight="400"
                className="color-[#767676] text-xs pb-0">
                {`/${chatRoom.max}명`}
              </CustomText>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default ChatCard;
