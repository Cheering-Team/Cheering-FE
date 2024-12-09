import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  AppState,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  View,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useGetChatRoomById, useGetChats} from 'apis/chat/useChats';
import {Chat, ChatResponse} from 'apis/chat/types';
import {Drawer} from 'react-native-drawer-layout';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import ChatRoomDrawerContent from './components/ChatRoomDrawerContent';
import ChatRoomHeader from './components/ChatRoomHeader';
import ChatRoomFooter from './components/ChatRoomFooter';
import ChatMessage from './components/ChatMessage';
import {useWebSocket} from 'context/useWebSocket';
import {StompSubscription} from '@stomp/stompjs';
import CustomText from 'components/common/CustomText';
const TextEncodingPolyfill = require('text-encoding');

Object.assign('global', {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});

const ChatRoomScreen = () => {
  const {chatRoomId} =
    useRoute<RouteProp<CommunityStackParamList, 'ChatRoom'>>().params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const {stompClient, isConnected} = useWebSocket();
  const subscriptionRefs = useRef<{
    participants: StompSubscription | null;
    chatRoom: StompSubscription | null;
  }>({participants: null, chatRoom: null});
  const appState = useRef(AppState.currentState);

  const [messages, setMessages] = useState<Chat[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);

  const flatListRef = useRef<FlatList>(null);

  const {
    data: chatRoom,
    refetch: refetchChatRoom,
    isError,
    error,
  } = useGetChatRoomById(chatRoomId, true);
  const {
    data: chats,
    refetch,
    hasNextPage,
    fetchNextPage,
    isError: chatIsError,
    error: chatError,
  } = useGetChats(chatRoomId);

  const handleNewMessage = useCallback((newMessage: ChatResponse) => {
    setMessages(prevMessages => {
      const firstGroup = prevMessages[0];

      if (
        newMessage.type === 'MESSAGE' &&
        firstGroup &&
        firstGroup.groupKey === newMessage.groupKey
      ) {
        const updatedMessages = [...prevMessages];
        updatedMessages[0].messages.push(newMessage.content);
        return updatedMessages;
      }
      return [
        {
          type: newMessage.type,
          createdAt: newMessage.createdAt,
          writer: {
            id: newMessage.writerId,
            name: newMessage.writerName,
            image: newMessage.writerImage,
          },
          messages: [newMessage.content],
          groupKey: newMessage.groupKey,
        },
        ...prevMessages,
      ];
    });
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const isBottom = event.nativeEvent.contentOffset.y <= 200;
      setIsAtBottom(isBottom);
    },
    [],
  );

  const renderChatMessage: ListRenderItem<Chat> = useCallback(
    ({item, index}) => {
      if (item.type === 'MESSAGE') {
        const currentMessageDate = new Date(item.createdAt).setHours(
          0,
          0,
          0,
          0,
        );
        const previousMessageDate =
          index < messages.length - 1
            ? new Date(messages[index + 1].createdAt).setHours(0, 0, 0, 0)
            : null;

        const isFirst =
          index === messages.length - 1 ||
          currentMessageDate !== previousMessageDate;

        return (
          <ChatMessage
            chat={item}
            isMy={item.writer.id === chatRoom?.user?.id}
            isFirst={isFirst}
          />
        );
      } else {
        return (
          <View className="justify-center items-center mb-[15] mt-[5]">
            <View className="bg-black/30 py-1 px-3 rounded-xl">
              <CustomText fontWeight="500" className="text-white text-sm">
                {item.messages[0]}
              </CustomText>
            </View>
          </View>
        );
      }
    },
    [chatRoom, messages],
  );

  const loadChat = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage]);

  useEffect(() => {
    if (chatRoom) {
      setParticipantCount(chatRoom.count);
    }
  }, [chatRoom]);

  useFocusEffect(
    useCallback(() => {
      const client = stompClient.current;

      const subscribeToChatRoom = async () => {
        const accessToken = await EncryptedStorage.getItem('accessToken');

        if (client && isConnected && accessToken) {
          const participantsSubscription = client.subscribe(
            `/topic/chatRoom/${chatRoomId}/participants`,
            message => {
              const body = JSON.parse(message.body);
              setParticipantCount(body.count);
              if (chatRoom?.type === 'PUBLIC') {
                handleNewMessage(body);
              }
            },
          );
          subscriptionRefs.current.participants = participantsSubscription;

          const chatRoomSubscription = client.subscribe(
            `/topic/chatRoom/${chatRoomId}`,
            message => {
              handleNewMessage(JSON.parse(message.body));
            },
            {
              Authorization: `Bearer ${accessToken}`,
            },
          );
          subscriptionRefs.current.chatRoom = chatRoomSubscription;
        }
      };

      subscribeToChatRoom();
    }, [
      chatRoom?.type,
      chatRoomId,
      handleNewMessage,
      isConnected,
      stompClient,
    ]),
  );

  // focus시 소켓 연결 확인
  // blur시 구독 해제
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (stompClient.current && isConnected) {
          stompClient.current.publish({
            destination: `/app/chatRooms/exit`,
            body: JSON.stringify({chatRoomId}),
          });
          const {participants, chatRoom: chatRoomSub} =
            subscriptionRefs.current;
          if (participants) participants.unsubscribe();
          if (chatRoomSub) chatRoomSub.unsubscribe();
          subscriptionRefs.current = {participants: null, chatRoom: null};
        }
      };
    }, [chatRoomId, isConnected, stompClient]),
  );

  useFocusEffect(
    useCallback(() => {
      const client = stompClient.current;

      return () => {
        if (client) {
          if (chatRoom?.type === 'OFFICIAL' && client.connected) {
            client.publish({
              destination: `/app/chatRooms/leave`,
              body: JSON.stringify({chatRoomId}),
            });
          }
        }
      };
    }, [chatRoom?.type, chatRoomId, stompClient]),
  );

  // 채팅 불러오기 및 표시
  useEffect(() => {
    if (chats) {
      setMessages(chats.pages.flatMap(page => page.chats));
    }
  }, [chats]);

  // Focus시 채팅 다시 불러오기
  useFocusEffect(
    useCallback(() => {
      refetchChatRoom();
      refetch();
    }, [refetch, refetchChatRoom]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          refetch();
        }
        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [refetch]);

  useEffect(() => {
    if (
      (isError && error.message === '존재하지 않는 채팅방') ||
      (chatIsError && chatError.message === '존재하지 않는 채팅방')
    ) {
      navigation.goBack();
    }
  }, [
    chatError?.message,
    chatIsError,
    error?.message,
    insets.top,
    isError,
    navigation,
  ]);

  if (!chatRoom) {
    return null;
  }

  return (
    <Drawer
      drawerType="front"
      drawerPosition="right"
      open={isDrawerOpen}
      onOpen={() => setIsDrawerOpen(true)}
      onClose={() => setIsDrawerOpen(false)}
      renderDrawerContent={() => (
        <ChatRoomDrawerContent
          chatRoom={chatRoom}
          setIsDrawerOpen={setIsDrawerOpen}
          client={stompClient}
        />
      )}
      style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={-insets.bottom}>
        <ChatRoomHeader
          chatRoom={chatRoom}
          setIsDrawerOpen={setIsDrawerOpen}
          participantCount={participantCount}
        />
        <FlatList
          inverted
          automaticallyAdjustsScrollIndicatorInsets={true}
          ref={flatListRef}
          contentContainerStyle={{
            paddingBottom: insets.top + 110,
            paddingHorizontal: 10,
          }}
          data={messages}
          renderItem={renderChatMessage}
          keyExtractor={(item, index) => `${item.groupKey}-${index}`}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          maintainVisibleContentPosition={
            isAtBottom ? undefined : {minIndexForVisible: 0}
          }
          onEndReached={loadChat}
          onEndReachedThreshold={1}
        />
        <ChatRoomFooter
          client={stompClient}
          chatRoom={chatRoom}
          flatListRef={flatListRef}
          isAtBottom={isAtBottom}
        />
      </KeyboardAvoidingView>
    </Drawer>
  );
};

export default ChatRoomScreen;
