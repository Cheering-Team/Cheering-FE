import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useGetChatRoomById, useGetChats} from 'apis/chat/useChats';
import {Chat, ChatResponse} from 'apis/chat/types';
import {Drawer} from 'react-native-drawer-layout';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import ChatRoomEnterLoading from './components/ChatRoomEnterLoading';
import ChatRoomDrawerContent from './components/ChatRoomDrawerContent';
import ChatRoomHeader from './components/ChatRoomHeader';
import ChatRoomFooter from './components/ChatRoomFooter';
import ChatMessage from './components/ChatMessage';
import {useWebSocket} from 'context/useWebSocket';
import {StompSubscription} from '@stomp/stompjs';
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

  const {stompClient, activateWebSocket} = useWebSocket();
  const subscriptionRefs = useRef<{
    participants: StompSubscription | null;
    chatRoom: StompSubscription | null;
  }>({participants: null, chatRoom: null});

  const [messages, setMessages] = useState<Chat[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);

  const flatListRef = useRef<FlatList>(null);

  const {data: chatRoom, isError, error} = useGetChatRoomById(chatRoomId, true);
  const {
    data: chats,
    hasNextPage,
    fetchNextPage,
    isError: chatIsError,
    error: chatError,
  } = useGetChats(chatRoomId);

  const handleNewMessage = useCallback((newMessage: ChatResponse) => {
    setMessages(prevMessages => {
      const firstGroup = prevMessages[0];

      if (
        firstGroup &&
        firstGroup.sender.id === newMessage.sender.id &&
        firstGroup.createdAt.substring(0, 16) ===
          newMessage.createdAt.substring(0, 16)
      ) {
        return prevMessages.map((group, index) =>
          index === 0
            ? {...group, messages: [...group.messages, newMessage.message]}
            : group,
        );
      }

      return [
        {
          createdAt: newMessage.createdAt.substring(0, 16),
          sender: newMessage.sender,
          messages: [newMessage.message],
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
      const currentMessageDate = new Date(item.createdAt).setHours(0, 0, 0, 0);
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
          isMy={item.sender.id === chatRoom?.user?.id}
          isFirst={isFirst}
        />
      );
    },
    [chatRoom?.user?.id, messages],
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

      if (!client || !client.connected) {
        activateWebSocket();
      }

      const subscribeToChatRoom = async () => {
        const accessToken = await EncryptedStorage.getItem('accessToken');
        if (client && client.connected && accessToken) {
          const participantsSubscription = client.subscribe(
            `/topic/chatRoom/${chatRoomId}/participants`,
            message => {
              const updatedCount = JSON.parse(message.body);
              setParticipantCount(updatedCount);
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

      return () => {
        if (client) {
          client.publish({
            destination: `/app/chatRooms/exit`,
            body: JSON.stringify({chatRoomId}),
          });
          const {participants, chatRoom: chatRoomSub} =
            subscriptionRefs.current;
          if (participants) participants.unsubscribe();
          if (chatRoomSub) chatRoomSub.unsubscribe();

          // 구독 객체 초기화
          subscriptionRefs.current = {participants: null, chatRoom: null};
        }
      };
    }, [activateWebSocket, chatRoomId, handleNewMessage, stompClient]),
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

  useEffect(() => {
    setMessages(chats?.pages.flatMap(page => page.chats) || []);
  }, [chats]);

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
    return <ChatRoomEnterLoading />;
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
          keyExtractor={(item, index) => index.toString()}
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
          chatRoomId={chatRoomId}
          flatListRef={flatListRef}
          isAtBottom={isAtBottom}
        />
      </KeyboardAvoidingView>
    </Drawer>
  );
};

export default ChatRoomScreen;
