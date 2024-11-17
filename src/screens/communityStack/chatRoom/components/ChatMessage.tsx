import {Chat} from 'apis/chat/types';
import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import {WINDOW_WIDTH} from 'constants/dimension';
import React, {memo} from 'react';
import {View} from 'react-native';
import {formatDay, formatTime} from 'utils/format';

interface ChatMessageProps {
  isMy: boolean;
  chat: Chat;
  isFirst: boolean;
}

const ChatMessage = ({isMy, chat, isFirst}: ChatMessageProps) => {
  return (
    <>
      {isMy ? (
        <View
          style={{
            alignSelf: 'flex-end',
            alignItems: 'flex-end',
            maxWidth: WINDOW_WIDTH / 1.8,
            marginBottom: 7,
          }}>
          {chat.messages.map((message, index) => (
            <View
              key={index}
              style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              {chat.messages.length - 1 === index && (
                <CustomText
                  className="text-xs"
                  style={{
                    marginRight: 5,
                    marginBottom: 2,
                    color: '#575757',
                  }}>
                  {formatTime(chat.createdAt)}
                </CustomText>
              )}
              <View
                style={{
                  backgroundColor: '#f1f1f1',
                  paddingVertical: 7,
                  paddingHorizontal: 12,
                  borderRadius: 15,
                  marginTop: 5,
                }}>
                <CustomText
                  key={index}
                  className="text-base"
                  numberOfLines={999}
                  style={{color: '#343434'}}>
                  {message}
                </CustomText>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            maxWidth: WINDOW_WIDTH / 1.8,
            marginBottom: 7,
          }}>
          <Avatar uri={chat.sender.image} size={32} />
          <View style={{marginLeft: 7, marginTop: 1}}>
            <CustomText
              fontWeight="500"
              style={{color: '#6a6a6a', marginLeft: 2}}>
              {chat.sender.name}
            </CustomText>
            {chat.messages.map((message, index) => (
              <View
                key={index}
                style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <View
                  style={{
                    backgroundColor: '#f1f1f1',
                    paddingVertical: 7,
                    paddingHorizontal: 12,
                    borderRadius: 15,
                    marginTop: 5,
                  }}>
                  <CustomText
                    key={index}
                    numberOfLines={999}
                    className="text-base"
                    style={{color: '#343434'}}>
                    {message}
                  </CustomText>
                </View>
                {chat.messages.length - 1 === index && (
                  <CustomText
                    className="text-xs"
                    style={{
                      marginLeft: 5,
                      marginBottom: 2,
                      color: '#575757',
                    }}>
                    {formatTime(chat.createdAt)}
                  </CustomText>
                )}
              </View>
            ))}
          </View>
        </View>
      )}
      {isFirst && (
        <View className="justify-center items-center mb-[15] mt-[5]">
          <View className="bg-black/30 py-1 px-3 rounded-xl">
            <CustomText fontWeight="500" className="text-white text-sm">
              {formatDay(chat.createdAt)}
            </CustomText>
          </View>
        </View>
      )}
    </>
  );
};

export default memo(ChatMessage);
