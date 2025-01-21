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
import {
  useGetChatRoomById,
  useGetChats,
  useUpdateExitTime,
} from 'apis/chat/useChats';
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
import {queryClient} from '../../../../App';
import {chatRoomKeys} from 'apis/chat/queries';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import PrivateChatRoomHeader from './components/PrivateChatRoomHeader';
import JoinRequestMessage from './components/JoinRequestMessage';
import JoinAcceptMessage from './components/JoinAcceptMessage';
import OneButtonModal from 'components/common/OneButtonModal';
const TextEncodingPolyfill = require('text-encoding');

Object.assign('global', {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});

const ChatRoomScreen = () => {
  useDarkStatusBar();
  const {chatRoomId, type} =
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
  const [isPrivateFirst, setIsPrivateFirst] = useState(false);
  const [isExceeded, setIsExceeded] = useState(false);
  const [isRestrictedMatchModal, setIsRestrictedMatchModal] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const {
    data: chatRoom,
    isError,
    error,
  } = useGetChatRoomById(chatRoomId, type, true);
  const {
    data: chats,
    refetch,
    hasNextPage,
    fetchNextPage,
    isError: chatIsError,
    error: chatError,
  } = useGetChats(chatRoomId);
  const {mutate: updateExitTime} = useUpdateExitTime();

  const handleNewMessage = useCallback(
    (newMessage: ChatResponse) => {
      if (newMessage.type === 'ERROR') {
        if (newMessage.content === '2015') {
          if (chatRoom?.user && newMessage.writerId === chatRoom?.user.id) {
            setIsExceeded(true);
          }
          return;
        }
        if (newMessage.content === '2013') {
          if (chatRoom?.user && newMessage.writerId === chatRoom?.user.id) {
            setIsRestrictedMatchModal(true);
          }
          return;
        }
      }
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
    },
    [chatRoom?.user],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const isBottom = event.nativeEvent.contentOffset.y <= 200;
      setIsAtBottom(isBottom);
    },
    [],
  );

  const renderChatMessage: ListRenderItem<Chat> = useCallback(
    ({item, index}) => {
      if (chatRoom) {
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
              chatRoom={chatRoom}
            />
          );
        } else if (item.type === 'JOIN_REQUEST') {
          return (
            <JoinRequestMessage
              chat={item}
              chatRoom={chatRoom}
              meetId={chatRoom.meetId}
              client={stompClient}
            />
          );
        } else if (item.type === 'JOIN_ACCEPT') {
          return (
            <JoinAcceptMessage
              chat={item}
              meetId={chatRoom.meetId}
              chatRoomId={chatRoom.id}
              communityId={chatRoom.communityId}
            />
          );
        } else {
          return (
            <View className="justify-center items-center">
              <View className="justify-center items-center mb-[15] mt-[5] max-w-[80%]">
                <View className="bg-black/30 py-1 px-3 rounded-xl">
                  <CustomText
                    numberOfLines={999}
                    fontWeight="500"
                    className="text-white text-[13px] text-center">
                    {item.messages[0]}
                  </CustomText>
                </View>
              </View>
            </View>
          );
        }
      } else {
        return null;
      }
    },
    [chatRoom, messages, stompClient],
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

        if (client && isConnected && accessToken && chatRoom?.type) {
          const participantsSubscription = client.subscribe(
            `/topic/chatRoom/${chatRoomId}/participants`,
            message => {
              const body = JSON.parse(message.body);
              setParticipantCount(body.count);
              if (chatRoom?.type === 'PUBLIC') {
                handleNewMessage(body);
                queryClient.invalidateQueries({
                  queryKey: chatRoomKeys.participants(chatRoomId),
                });
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

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (stompClient.current && isConnected) {
          queryClient.invalidateQueries({queryKey: chatRoomKeys.lists()});
          const {participants, chatRoom: chatRoomSub} =
            subscriptionRefs.current;
          if (participants) participants.unsubscribe();
          if (chatRoomSub) chatRoomSub.unsubscribe();
          subscriptionRefs.current = {participants: null, chatRoom: null};
        }
      };
    }, [isConnected, stompClient]),
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (isConnected && chatRoom?.type !== 'PRIVATE') {
          updateExitTime({chatRoomId});
        }
        if (
          stompClient.current &&
          isConnected &&
          chatRoom?.type === 'OFFICIAL'
        ) {
          stompClient.current.publish({
            destination: `/app/chatRooms/leave`,
            body: JSON.stringify({chatRoomId}),
          });
        }
      };
    }, [chatRoom?.type, chatRoomId, isConnected, stompClient, updateExitTime]),
  );

  // 채팅 불러오기 및 표시
  useEffect(() => {
    if (chats) {
      setMessages(chats.pages.flatMap(page => page.chats));
    }
  }, [chats]);

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
  }, [chatRoomId, refetch, stompClient]);

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

  // Private + 첫 채팅일 경우 MeetFan 생성
  useEffect(() => {
    if (chatRoom?.type === 'PRIVATE') {
      const hasNoMessages = !messages.some(
        message => message.type === 'MESSAGE',
      );
      setIsPrivateFirst(hasNoMessages);
    }
  }, [messages, chatRoom]);

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
        {(chatRoom.type === 'PRIVATE' || chatRoom.type === 'CONFIRM') && (
          <PrivateChatRoomHeader chatRoom={chatRoom} client={stompClient} />
        )}
        {(chatRoom.type === 'OFFICIAL' || chatRoom.type === 'PUBLIC') && (
          <ChatRoomHeader
            chatRoom={chatRoom}
            setIsDrawerOpen={setIsDrawerOpen}
            participantCount={participantCount}
          />
        )}

        <FlatList
          inverted
          automaticallyAdjustsScrollIndicatorInsets={true}
          ref={flatListRef}
          contentContainerStyle={{
            paddingBottom: insets.top + 400,
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
          isPrivateFirst={isPrivateFirst}
        />
      </KeyboardAvoidingView>
      {isExceeded && (
        <OneButtonModal
          title="인원 초과"
          content="모임의 인원이 이미 가득 찼습니다"
          onButtonPress={() => {
            setIsExceeded(false);
          }}
        />
      )}
      {isRestrictedMatchModal && (
        <OneButtonModal
          title="모임 생성 제한"
          content="해당 경기 시작 48시간전에 취소한 모임이 있기 때문에 해당 경기 모임을 생성할 수 없습니다."
          onButtonPress={() => setIsRestrictedMatchModal(false)}
        />
      )}
    </Drawer>
  );
};

export default ChatRoomScreen;
