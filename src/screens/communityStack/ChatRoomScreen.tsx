import {useNavigation} from '@react-navigation/native';
import * as StompJs from '@stomp/stompjs';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  SafeAreaView,
  TextInput,
  View,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {reIssueToken} from '../../apis';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowSvg from '../../../assets/images/arrow_up.svg';
import CustomText from '../../components/common/CustomText';
import ChevronLeftSvg from '../../../assets/images/chevron-left.svg';
import {
  useDeleteChatRoom,
  useGetChatRoomById,
  useGetChats,
  useGetParticipants,
} from '../../apis/chat/useChats';
import {BlurView} from '@react-native-community/blur';
import OfficialSvg from '../../../assets/images/official.svg';
import ChevronRightSvg from '../../../assets/images/chevron-right-gray.svg';
import MegaphoneSvg from '../../../assets/images/megaphone.svg';
import {useQueryClient} from '@tanstack/react-query';
import {chatRoomKeys} from '../../apis/chat/queries';
import {Chat, ChatResponse} from '../../apis/chat/types';
import Avatar from '../../components/common/Avatar';
import {formatTime} from '../../utils/format';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import ChevronDownSvg from '../../../assets/images/chevron-down-black-thin.svg';
import ChevronDownGraySvg from '../../../assets/images/chevron-down-gray.svg';
import ChevronUpGraySvg from '../../../assets/images/chevron-up-gray.svg';
import PersonSvg from '../../../assets/images/person-gray.svg';
import {Drawer} from 'react-native-drawer-layout';
import DrawerSvg from '../../../assets/images/drawer.svg';
import ExitSvg from '../../../assets/images/exit-gray.svg';
import AlertModal from 'components/common/AlertModal/AlertModal';
import {showBottomToast} from 'utils/toast';

const TextEncodingPolyfill = require('text-encoding');

Object.assign('global', {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});

const ChatRoomScreen = ({route}) => {
  const {chatRoomId} = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [messages, setMessages] = useState<Chat[]>([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [isRefresh, setIsRefresh] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExitAlertOpen, setIsExitAlertOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const client = useRef<StompJs.Client | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const {data, refetch} = useGetChatRoomById(chatRoomId, false);
  const {data: chatData, hasNextPage, fetchNextPage} = useGetChats(chatRoomId);
  const {data: participants} = useGetParticipants(chatRoomId);
  const {mutateAsync: deleteChatRoom} = useDeleteChatRoom();

  const connect = async () => {
    const accessToken = await EncryptedStorage.getItem('accessToken');

    if (accessToken) {
      client.current = new StompJs.Client({
        brokerURL: 'ws://15.165.150.47/ws',
        onConnect: () => {
          subscribe();

          setTimeout(() => {
            refetch();
            setIsLoading(false);
          }, 500);
        },
        onStompError: async frame => {
          if (frame.body === '토큰이 만료되었습니다.') {
            client.current?.deactivate();

            const tokenData = await reIssueToken();

            const {accessToken: newToken, refreshToken} = tokenData.result;

            await EncryptedStorage.setItem('accessToken', newToken);
            await EncryptedStorage.setItem('refreshToken', refreshToken);

            setIsRefresh(true);
          }
        },
        connectHeaders: {
          Authorization: accessToken,
          chatRoomId: chatRoomId,
        },
      });
      client.current.activate();
    }
  };

  const publish = () => {
    if (!client.current?.connected) {
      return;
    }

    if (text.trim().length === 0) {
      return;
    }

    client.current?.publish({
      destination: '/pub/chat',
      body: JSON.stringify({
        chatRoomId: chatRoomId,
        message: text.trim(),
      }),
    });

    setText('');
  };

  const subscribe = () => {
    client.current?.subscribe('/sub/chat/' + chatRoomId, body => {
      handleNewMessage(JSON.parse(body.body));
    });

    client.current?.subscribe('/sub/' + chatRoomId + '/count', () => {
      refetch();
    });
  };

  const disconnect = () => {
    if (data?.result.type === 'OFFICIAL') {
      client.current?.publish({
        destination: '/pub/disconnect',
        body: JSON.stringify({
          chatRoomId: chatRoomId,
        }),
      });
    }
    client.current?.deactivate();
    queryClient.invalidateQueries({queryKey: chatRoomKeys.lists()});
  };

  const sendMessage = () => {
    publish();
  };

  const handleNewMessage = (newMessage: ChatResponse) => {
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
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const isBottom = event.nativeEvent.contentOffset.y <= 200;
    setIsAtBottom(isBottom);
  };

  const renderChatMessage: ListRenderItem<Chat> = ({item}) => {
    if (item.sender.id === data?.result.playerUser?.id) {
      return (
        <View
          style={{
            alignSelf: 'flex-end',
            alignItems: 'flex-end',
            maxWidth: WINDOW_WIDTH / 1.8,
          }}>
          {item.messages.map((message, index) => (
            <View
              key={index}
              style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              {item.messages.length - 1 === index && (
                <CustomText
                  style={{marginRight: 5, fontSize: 10.5, color: '#575757'}}>
                  {formatTime(item.createdAt)}
                </CustomText>
              )}
              <View
                style={{
                  backgroundColor: '#f1f1f1',
                  paddingVertical: 5,
                  paddingHorizontal: 13,
                  borderRadius: 15,
                  marginBottom: 5,
                }}>
                <CustomText
                  key={index}
                  style={{fontSize: 16, color: '#343434'}}>
                  {message}
                </CustomText>
              </View>
            </View>
          ))}
        </View>
      );
    } else {
      return (
        <View style={{flexDirection: 'row', maxWidth: WINDOW_WIDTH / 1.8}}>
          <Avatar uri={item.sender.image} size={30} style={{marginTop: 3}} />
          <View style={{marginLeft: 7}}>
            <CustomText style={{color: '#464646', marginBottom: 5}}>
              {item.sender.nickname}
            </CustomText>
            {item.messages.map((message, index) => (
              <View
                key={index}
                style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <View
                  style={{
                    backgroundColor: '#f1f1f1',
                    paddingVertical: 5,
                    paddingHorizontal: 13,
                    borderRadius: 15,
                    marginBottom: 5,
                  }}>
                  <CustomText
                    key={index}
                    style={{fontSize: 16, color: '#343434'}}>
                    {message}
                  </CustomText>
                </View>
                {item.messages.length - 1 === index && (
                  <CustomText
                    style={{marginLeft: 5, fontSize: 10.5, color: '#575757'}}>
                    {formatTime(item.createdAt)}
                  </CustomText>
                )}
              </View>
            ))}
          </View>
        </View>
      );
    }
  };

  const loadChat = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const handleDeleteChatRoom = async () => {
    const data = await deleteChatRoom({chatRoomId});
    if (data.message === '채팅방을 삭제하였습니다.') {
      client.current?.deactivate();
      queryClient.invalidateQueries({queryKey: chatRoomKeys.lists()});
      showBottomToast(insets.bottom + 20, data.message);
      navigation.goBack();
    }
  };

  useEffect(() => {
    connect();

    return () => disconnect();
  }, []);

  useEffect(() => {
    if (isRefresh) {
      connect();
    }
  }, [isRefresh]);

  useEffect(() => {
    setMessages(chatData?.pages.flatMap(page => page.result.chats) || []);
  }, [chatData]);

  if (!data || isLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <CustomText fontWeight="500" style={{fontSize: 20}}>
          입장중입니다..
        </CustomText>
        <ActivityIndicator size={100} />
      </View>
    );
  }

  return (
    <Drawer
      drawerType="front"
      drawerPosition="right"
      open={isDrawerOpen}
      onOpen={() => setIsDrawerOpen(true)}
      onClose={() => setIsDrawerOpen(false)}
      renderDrawerContent={() => (
        <SafeAreaView className="flex-1">
          {data.result.type === 'OFFICIAL' ? (
            <View className="flex-1" />
          ) : (
            <FlatList
              data={participants?.result}
              contentContainerStyle={{
                paddingHorizontal: 15,
                paddingVertical: 5,
              }}
              ListHeaderComponent={
                <>
                  <CustomText fontWeight="500" className="text-[17px] mb-2">
                    대화상대
                  </CustomText>
                  <Pressable
                    className="flex-row items-center py-[7]"
                    onPress={() =>
                      navigation.navigate('Profile', {
                        playerUserId: data.result.creator.id,
                      })
                    }>
                    <Avatar uri={data.result.creator?.image} size={32} />
                    <View className="bg-gray-800 rounded-xl px-1 py-[1] mx-[5]">
                      <CustomText
                        fontWeight="600"
                        className="text-[11px] text-white">
                        방장
                      </CustomText>
                    </View>
                    <CustomText>{data.result.creator?.nickname}</CustomText>
                  </Pressable>
                </>
              }
              renderItem={({item}) => (
                <Pressable
                  className="flex-row items-center py-[7]"
                  onPress={() =>
                    navigation.navigate('Profile', {
                      playerUserId: item.id,
                    })
                  }>
                  <Avatar uri={item.image} size={32} />
                  <CustomText className="ml-2">{item.nickname}</CustomText>
                </Pressable>
              )}
              className="flex-1"
            />
          )}

          <Pressable
            className="h-[48] border-t border-t-[#eeeeee] items-center px-4 flex-row-reverse"
            onPress={() =>
              data.result.creator?.id === data.result.playerUser?.id
                ? setIsDeleteAlertOpen(true)
                : setIsExitAlertOpen(true)
            }>
            <ExitSvg width={24} height={24} />
            <CustomText className="mr-3 text-[#555555] text-[15px]">
              {data.result.creator?.id === data.result.playerUser?.id
                ? '채팅방 삭제'
                : '채팅방 나가기'}
            </CustomText>
          </Pressable>
          {data.result.creator?.id === data.result.playerUser?.id ? (
            <AlertModal
              isModalOpen={isDeleteAlertOpen}
              setIsModalOpen={setIsDeleteAlertOpen}
              title="채팅방을 삭제하시겠습니까?"
              content="방장이기 때문에 나가실 경우 채팅방이 삭제됩니다."
              button1Text="삭제"
              button1Color="#ff2626"
              button2Text="취소"
              button1Press={handleDeleteChatRoom}
            />
          ) : (
            <AlertModal
              isModalOpen={isExitAlertOpen}
              setIsModalOpen={setIsExitAlertOpen}
              title="채팅방에서 나가시겠습니까?"
              content="모든 대화내용이 삭제됩니다."
              button1Text="나가기"
              button1Color="#ff2626"
              button2Text="취소"
              button1Press={() => {
                client.current?.publish({
                  destination: '/pub/disconnect',
                  body: JSON.stringify({
                    chatRoomId: chatRoomId,
                  }),
                });
                client.current?.deactivate();
                queryClient.invalidateQueries({queryKey: chatRoomKeys.lists()});
                navigation.goBack();
              }}
            />
          )}
        </SafeAreaView>
      )}
      style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={-insets.bottom}>
        <View style={{position: 'absolute', width: '100%', zIndex: 5, flex: 1}}>
          <BlurView
            className="justify-between flex-1"
            blurType="light"
            style={{
              height: insets.top + 50,
              paddingTop: insets.top,
              flexDirection: 'row',
              paddingHorizontal: 5,
              alignItems: 'center',
            }}>
            <Pressable onPress={() => navigation.goBack()}>
              <ChevronLeftSvg width={35} height={35} />
            </Pressable>
            <View style={{marginLeft: 10, flex: 1}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CustomText
                  fontWeight="600"
                  style={{fontSize: 17, marginRight: 3}}>
                  {data?.result.name}
                </CustomText>
                {data.result.type === 'OFFICIAL' && (
                  <OfficialSvg width={15} height={15} />
                )}
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <PersonSvg width={10} height={10} />
                <CustomText className="color-[#626262] ml-[3]">{`${data.result.count}`}</CustomText>
                <View
                  style={{
                    width: 1,
                    height: 9,
                    backgroundColor: '#626262',
                    marginHorizontal: 4,
                  }}
                />
                <Pressable
                  onPress={() =>
                    navigation.navigate('Community', {
                      playerId: data.result.player.id,
                    })
                  }>
                  <CustomText style={{color: '#626262', marginRight: 2}}>
                    커뮤니티 바로가기
                  </CustomText>
                </Pressable>

                <ChevronRightSvg width={9} height={9} />
              </View>
            </View>
            <Pressable onPress={() => setIsDrawerOpen(true)}>
              <DrawerSvg width={27} height={27} style={{marginRight: 5}} />
            </Pressable>
          </BlurView>
          {data?.result.description !== '' && (
            <View
              className="mt-[5] mx-[10] rounded-[10px] bg-white py-[10] px-[15] flex-row border border-[#eeeeee]"
              style={{
                shadowColor: '#000000',
                shadowOffset: {
                  width: 3,
                  height: 3,
                },
                shadowOpacity: 0.1,
                shadowRadius: 10,
              }}>
              <MegaphoneSvg width={20} height={20} style={{marginTop: 2}} />
              <CustomText
                className="flex-1 text-[#484848] text-[15px] mx-[10]"
                numberOfLines={isDescriptionOpen ? undefined : 2}>
                {data?.result.description}
              </CustomText>
              <Pressable onPress={() => setIsDescriptionOpen(prev => !prev)}>
                {isDescriptionOpen ? (
                  <ChevronUpGraySvg
                    width={18}
                    height={18}
                    style={{marginTop: 2}}
                  />
                ) : (
                  <ChevronDownGraySvg
                    width={18}
                    height={18}
                    style={{marginTop: 2}}
                  />
                )}
              </Pressable>
            </View>
          )}
        </View>

        <FlatList
          inverted
          automaticallyAdjustsScrollIndicatorInsets={true}
          ref={flatListRef}
          contentContainerStyle={{
            paddingBottom: insets.top + 110,
            paddingHorizontal: 15,
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
            style={{
              padding: 8,
              paddingBottom: insets.bottom + 8,
            }}>
            <TextInput
              multiline
              value={text}
              onChangeText={setText}
              maxLength={150}
              style={{
                minHeight: 40,
                maxHeight: 100,
                paddingTop: 11,
                paddingBottom: 10,
                backgroundColor: '#f5f5f5',
                borderRadius: 20,
                fontSize: 16,
                paddingLeft: 15,
                paddingRight: 50,
              }}
            />
            <Pressable
              disabled={text.trim().length === 0}
              onPress={sendMessage}
              style={[
                {
                  backgroundColor: 'black',
                  position: 'absolute',
                  paddingHorizontal: 13,
                  paddingVertical: 9,
                  borderRadius: 20,
                  bottom: insets.bottom + 12,
                  right: 12,
                },
                text.trim().length === 0 && {backgroundColor: '#a1a1a1'},
              ]}>
              <ArrowSvg width={15} height={15} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Drawer>
  );
};

export default ChatRoomScreen;
