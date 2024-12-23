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
        className="flex-row rounded-[3px] items-center bg-white border border-[#eeeeee]"
        style={{
          paddingHorizontal: location === 'COMMUNITY' ? 6 : 8,
          paddingVertical: location === 'COMMUNITY' ? 9 : 11,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.03,
          shadowRadius: 3,
          elevation: 0.2,
        }}>
        <FastImage
          source={{uri: chatRoom.image}}
          className="rounded-[10px]"
          style={{
            width: location === 'COMMUNITY' ? 60 : 68,
            height: location === 'COMMUNITY' ? 60 : 68,
          }}
        />
        <View className="ml-3 flex-1">
          <CustomText
            fontWeight="500"
            className={`${location === 'COMMUNITY' ? 'text-[15px]' : 'text-[17px]'} mb-[4]`}
            style={{color: 'rgb(34,34,34)'}}
            ellipsizeMode="tail">
            {chatRoom.name}
          </CustomText>
          <CustomText
            fontWeight="400"
            className={`${location === 'COMMUNITY' ? 'text-[13px]' : 'text-[15px]'} mb-[3] ml-[1]`}
            style={{color: 'rgb(136,136,136)'}}
            ellipsizeMode="tail">
            {chatRoom.description}
          </CustomText>
          <View className="flex-row items-center ml-[1]">
            <CustomText
              className={`${location === 'COMMUNITY' ? 'text-[12px]' : 'text-[14px]'}`}
              style={{color: 'rgb(77,77,77)'}}>
              {`${chatRoom.count}`}
            </CustomText>
            <CustomText
              className={`${location === 'COMMUNITY' ? 'text-[12px]' : 'text-[14px]'} ml-[3]`}
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
        className="flex-row py-[8] px-[2] items-start"
        onPress={onPress}>
        <FastImage
          source={{uri: chatRoom.image}}
          className="w-[50] h-[50] rounded-[13px] border border-slate-200"
        />
        <View className="ml-3 flex-1 mt-[1]">
          <View className="flex-row items-center">
            <CustomText
              fontWeight="500"
              className="text-[15px] mb-[3]"
              numberOfLines={1}
              ellipsizeMode="tail">
              {chatRoom.name}
            </CustomText>
          </View>
          {chatRoom.description && (
            <CustomText
              className="color-[#727272] text-[13px] mb-[2] ml-[1]"
              numberOfLines={2}
              ellipsizeMode="tail">
              {chatRoom.description}
            </CustomText>
          )}
        </View>
        <View className="flex-row items-center ml-[1] mt-1">
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
      </Pressable>
    );
  } else {
    return (
      <Pressable
        key={chatRoom.id}
        className="flex-row py-[10] px-[14] rounded-xl items-center"
        onPress={onPress}>
        <FastImage
          source={{uri: chatRoom.image}}
          className="w-[50] h-[50] rounded-[13px] border border-slate-200"
        />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center mb-[3]">
            <CustomText
              fontWeight="500"
              className="text-[15px]"
              numberOfLines={1}
              ellipsizeMode="tail">
              {chatRoom.name}
            </CustomText>
            <CustomText
              fontWeight="600"
              className="color-[#888888] text-[14px] ml-2">
              {`${chatRoom.count}`}
            </CustomText>
            <CustomText className="color-[#888888] text-[14px] flex-1">
              {`/${chatRoom.max}`}
            </CustomText>
          </View>
          {chatRoom.lastMessage && (
            <CustomText
              className="color-[#727272] text-[14px] mb-[3] ml-[1]"
              numberOfLines={2}
              ellipsizeMode="tail">
              {chatRoom.lastMessage}
            </CustomText>
          )}
        </View>
        <View className="items-end ml-1">
          {chatRoom.lastMessageTime && (
            <CustomText className="text-[13px] text-gray-500">
              {formatTodayOr(chatRoom.lastMessageTime)}
            </CustomText>
          )}
          {chatRoom.unreadCount !== 0 ? (
            <View className="bg-[#fc3b3b] rounded-full min-w-[19] h-[19] px-1 justify-center items-center mt-1">
              <CustomText
                fontWeight="600"
                className="text-white text-center text-[12px]">
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
