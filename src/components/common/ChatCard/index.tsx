import React from 'react';
import {Pressable, View} from 'react-native';
import Avatar from '../Avatar';
import CustomText from '../CustomText';
import OfficialSvg from '../../../../assets/images/official.svg';
import {ChatRoom} from 'apis/chat/types';
import {useNavigation} from '@react-navigation/native';

interface ChatCardProps {
  chatRoom: ChatRoom;
}

const ChatCard = (props: ChatCardProps) => {
  const {chatRoom} = props;

  const navigation = useNavigation();

  return (
    <Pressable
      key={chatRoom.id}
      className="flex-row px-[15] py-[10]"
      onPress={() =>
        navigation.navigate('ChatRoom', {chatRoomId: chatRoom.id})
      }>
      <Avatar uri={chatRoom.image} size={59} className="rounded-2xl mt-1" />
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
        <CustomText fontWeight="500" className="color-[#4e4e4e] text-xs">
          {`${chatRoom.count} 명`}
        </CustomText>
      </View>
    </Pressable>
  );
};

export default ChatCard;
