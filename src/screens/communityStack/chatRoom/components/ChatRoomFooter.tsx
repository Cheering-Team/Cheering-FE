import {WINDOW_WIDTH} from 'constants/dimension';
import React, {MutableRefObject, RefObject, useState} from 'react';
import {FlatList, Platform, Pressable, TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowSvg from 'assets/images/arrow_up.svg';
import ChevronDownSvg from 'assets/images/chevron-down-black-thin.svg';
import {Client} from '@stomp/stompjs';
import {ChatRoom} from 'apis/chat/types';

interface ChatRoomFooterProps {
  client: MutableRefObject<Client | null>;
  chatRoom: ChatRoom;
  flatListRef: RefObject<FlatList<any>>;
  isAtBottom: boolean;
}

const ChatRoomFooter = ({
  client,
  chatRoom,
  flatListRef,
  isAtBottom,
}: ChatRoomFooterProps) => {
  const insets = useSafeAreaInsets();

  const [text, setText] = useState('');

  const sendMessage = () => {
    if (text.trim().length === 0) {
      return;
    }

    if (client.current && client.current.connected) {
      console.log(chatRoom);

      client.current?.publish({
        destination: `/app/chatRooms/${chatRoom.id}/sendMessage`,
        body: JSON.stringify({
          chatRoomType: chatRoom.type,
          writerId: chatRoom.user?.id,
          writerImage: chatRoom.user?.image,
          writerName: chatRoom.user?.name,
          content: text.trim(),
        }),
      });
    }
    setText('');
  };

  return (
    <View>
      {!isAtBottom && (
        <Pressable
          style={{
            width: 40,
            height: 40,
            position: 'absolute',
            zIndex: 10,
            bottom: insets.bottom + 65,
            left: WINDOW_WIDTH / 2 - 22.5,
            backgroundColor: '#f1f1f1',
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            flatListRef.current?.scrollToOffset({
              offset: 0,
              animated: true,
            });
          }}>
          <ChevronDownSvg width={20} height={20} />
        </Pressable>
      )}
      <View
        className="p-2"
        style={{
          paddingBottom: insets.bottom + 8,
        }}>
        <View
          className="flex-row bg-[#f5f5f5] rounded-[20px] justify-between pl-3"
          style={{paddingVertical: Platform.OS === 'ios' ? 9 : 6.5}}>
          <TextInput
            multiline
            value={text}
            onChangeText={setText}
            maxLength={150}
            allowFontScaling={false}
            className="flex-1 p-0 m-0 mr-[50] text-[15px] leading-[22px]"
            style={{
              fontFamily: 'NotoSansKR-Regular',
              includeFontPadding: false,
            }}
          />
          <Pressable
            disabled={text.trim().length === 0}
            onPress={sendMessage}
            style={[
              {
                position: 'absolute',
                right: 5,
                bottom: 4,
                backgroundColor: 'black',
                paddingHorizontal: 13,
                paddingVertical: 9,
                borderRadius: 20,
              },
              text.trim().length === 0 && {backgroundColor: '#a1a1a1'},
            ]}>
            <ArrowSvg width={15} height={15} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ChatRoomFooter;
