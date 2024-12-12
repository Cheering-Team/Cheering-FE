import React from 'react';
import {Pressable, View} from 'react-native';
import CustomText from '../CustomText';
import {ChatRoom} from 'apis/chat/types';
import FastImage from 'react-native-fast-image';
import {formatTodayOr} from 'utils/format';
interface ChatCardProps {
  chatRoom: ChatRoom;
  location: 'COMMUNITY' | 'MY';
  onPress: () => void;
}

const ChatCard = (props: ChatCardProps) => {
  const {chatRoom, location, onPress} = props;

  if (chatRoom.type === 'OFFICIAL') {
    return (
      <Pressable
        onPress={onPress}
        className="flex-row border border-gray-200 bg-white rounded-xl items-center"
        style={{
          paddingHorizontal: location === 'COMMUNITY' ? 10 : 13,
          paddingVertical: location === 'COMMUNITY' ? 12 : 15,
          shadowColor: '#343434',
          shadowOffset: {width: 1, height: 3},
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 2,
        }}>
        <FastImage
          source={{uri: chatRoom.image}}
          className="rounded-[10px]"
          style={{
            width: location === 'COMMUNITY' ? 60 : 64,
            height: location === 'COMMUNITY' ? 60 : 64,
          }}
        />
        <View className="ml-4 flex-1">
          <CustomText
            fontWeight="700"
            className={`${location === 'COMMUNITY' ? 'text-lg' : 'text-xl'} `}
            style={{color: 'rgb(34,34,34)'}}
            ellipsizeMode="tail">
            {chatRoom.name}
          </CustomText>
          <CustomText
            fontWeight="400"
            className={`${location === 'COMMUNITY' ? 'text-[15px]' : 'text-[17px]'} mb-[3] ml-[1]`}
            style={{color: 'rgb(136,136,136)'}}
            ellipsizeMode="tail">
            {chatRoom.description}
          </CustomText>
          <View className="flex-row items-center ml-[1]">
            <CustomText
              fontWeight="500"
              className={`${location === 'COMMUNITY' ? 'text-[14px]' : 'text-[16px]'} pb-0`}
              style={{color: 'rgb(77,77,77)'}}>
              {`${chatRoom.count}`}
            </CustomText>
            <CustomText
              fontWeight="500"
              className={`${location === 'COMMUNITY' ? 'text-[14px]' : 'text-[16px]'} pb-0 ml-[3]`}
              style={{color: 'rgb(77,77,77)'}}>
              {`명 참여중`}
            </CustomText>
          </View>
        </View>
      </Pressable>
    );
  } else if (location === 'COMMUNITY') {
    return (
      <Pressable
        key={chatRoom.id}
        className="flex-row py-3 px-2 rounded-xl items-center"
        onPress={onPress}>
        <FastImage
          source={{uri: chatRoom.image}}
          className="w-[59] h-[59] rounded-[20px] border border-slate-200"
        />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <CustomText
              fontWeight="500"
              className="text-[17px] mb-[3]"
              numberOfLines={1}
              ellipsizeMode="tail">
              {chatRoom.name}
            </CustomText>
          </View>
          {chatRoom.description && (
            <CustomText
              className="color-[#727272] text-[15px] mb-[3] ml-[1]"
              numberOfLines={1}
              ellipsizeMode="tail">
              {chatRoom.description}
            </CustomText>
          )}
          <View className="flex-row items-center ml-[1]">
            <CustomText
              fontWeight="700"
              className="color-[#767676] text-[13px] pb-0">
              {`${chatRoom.count}`}
            </CustomText>
            <CustomText
              fontWeight="400"
              className="color-[#767676] text-[13px] pb-0">
              {`/${chatRoom.max}명`}
            </CustomText>
          </View>
        </View>
      </Pressable>
    );
  } else {
    return (
      <Pressable
        key={chatRoom.id}
        className="flex-row py-3 px-[14] rounded-xl items-center"
        onPress={onPress}>
        <FastImage
          source={{uri: chatRoom.image}}
          className="w-[54] h-[54] rounded-[20px] border border-slate-200"
        />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center mb-[3]">
            <CustomText
              fontWeight="500"
              className="text-[17px]"
              numberOfLines={1}
              ellipsizeMode="tail">
              {chatRoom.name}
            </CustomText>
            <CustomText
              fontWeight="600"
              className="color-[#888888] text-[17px] ml-[4]">
              {`${chatRoom.count}`}
            </CustomText>
            <CustomText className="color-[#888888] text-[17px] flex-1">
              {`/${chatRoom.max}`}
            </CustomText>
          </View>
          {chatRoom.lastMessage && (
            <CustomText
              className="color-[#727272] text-[15px] mb-[3] ml-[1]"
              numberOfLines={2}
              ellipsizeMode="tail">
              {chatRoom.lastMessage}
            </CustomText>
          )}
        </View>
        <View className="items-end ml-1">
          {chatRoom.lastMessageTime && (
            <CustomText className="text-gray-500">
              {formatTodayOr(chatRoom.lastMessageTime)}
            </CustomText>
          )}
          {chatRoom.unreadCount !== 0 ? (
            <View className="bg-[#fc3b3b] rounded-full min-w-[20] h-[20] px-1 justify-center items-center mt-1">
              <CustomText fontWeight="600" className="text-white text-center">
                {chatRoom.unreadCount}
              </CustomText>
            </View>
          ) : (
            <View className="w-[20] h-[20]" />
          )}
        </View>
      </Pressable>
    );
  }
};

export default ChatCard;
