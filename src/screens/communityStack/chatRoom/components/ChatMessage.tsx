import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Chat} from 'apis/chat/types';
import Avatar from 'components/common/Avatar';
import CustomText from 'components/common/CustomText';
import {WINDOW_WIDTH} from 'constants/dimension';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import React, {memo} from 'react';
import {Pressable, View} from 'react-native';
import {formatDay, formatAmPmTime} from 'utils/format';

interface ChatMessageProps {
  isMy: boolean;
  chat: Chat;
  isFirst: boolean;
}

const ChatMessage = ({isMy, chat, isFirst}: ChatMessageProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

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
                  className="text-[11px]"
                  style={{
                    marginRight: 5,
                    marginBottom: 2,
                    color: '#575757',
                  }}>
                  {formatAmPmTime(chat.createdAt)}
                </CustomText>
              )}
              <View
                style={{
                  backgroundColor: '#f1f1f1',
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  marginTop: 5,
                }}>
                <CustomText
                  key={index}
                  className="text-[15px] leading-[22px]"
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
          <Pressable
            onPress={() => {
              navigation.navigate('Profile', {fanId: chat.writer.id});
            }}>
            <Avatar uri={chat.writer.image} size={32} className="mt-[2]" />
          </Pressable>

          <View style={{marginLeft: 6, marginTop: 1}}>
            <Pressable
              onPress={() => {
                navigation.navigate('Profile', {fanId: chat.writer.id});
              }}>
              <CustomText
                fontWeight="500"
                style={{color: '#6a6a6a', marginLeft: 2}}
                className="text-[13px]">
                {chat.writer.name}
              </CustomText>
            </Pressable>
            {chat.messages.map((message, index) => (
              <View
                key={index}
                style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <View
                  style={{
                    backgroundColor: '#f1f1f1',
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    marginTop: 5,
                  }}>
                  <CustomText
                    key={index}
                    numberOfLines={999}
                    className="text-[15px] leading-[22px]"
                    style={{color: '#343434'}}>
                    {message}
                  </CustomText>
                </View>
                {chat.messages.length - 1 === index && (
                  <CustomText
                    className="text-[11px]"
                    style={{
                      marginLeft: 5,
                      marginBottom: 2,
                      color: '#575757',
                    }}>
                    {formatAmPmTime(chat.createdAt)}
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
            <CustomText fontWeight="500" className="text-white text-[13px]">
              {formatDay(chat.createdAt)}
            </CustomText>
          </View>
        </View>
      )}
    </>
  );
};

export default ChatMessage;
