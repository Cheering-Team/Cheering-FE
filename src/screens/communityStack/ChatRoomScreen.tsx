import {useNavigation} from '@react-navigation/native';
import * as StompJs from '@stomp/stompjs';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {reIssueToken} from '../../apis';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowSvg from '../../../assets/images/arrow_up.svg';
import CustomText from '../../components/common/CustomText';
import ChevronLeftSvg from '../../../assets/images/chevron-left.svg';
import {useGetChatRoomById} from '../../apis/chat/useChats';
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

  const client = useRef<StompJs.Client | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const {data, refetch} = useGetChatRoomById(chatRoomId);

  const connect = async () => {
    const accessToken = await EncryptedStorage.getItem('accessToken');

    if (accessToken) {
      client.current = new StompJs.Client({
        brokerURL: 'ws://172.30.1.47:8080/ws',
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
    client.current?.publish({
      destination: '/pub/disconnect',
      body: JSON.stringify({
        chatRoomId: chatRoomId,
      }),
    });
    client.current?.deactivate();
    queryClient.invalidateQueries({queryKey: chatRoomKeys.lists()});
  };

  const sendMessage = () => {
    publish();
  };

  const handleNewMessage = (newMessage: ChatResponse) => {
    setMessages(prevMessages => {
      const lastGroup = prevMessages[prevMessages.length - 1];

      if (
        lastGroup &&
        lastGroup.sender.id === newMessage.sender.id &&
        lastGroup.createdAt === newMessage.createdAt.substring(0, 16)
      ) {
        return prevMessages.map((group, index) =>
          index === prevMessages.length - 1
            ? {...group, messages: [...group.messages, newMessage.message]}
            : group,
        );
      }

      return [
        ...prevMessages,
        {
          createdAt: newMessage.createdAt.substring(0, 16),
          sender: newMessage.sender,
          messages: [newMessage.message],
        },
      ];
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;
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

  useEffect(() => {
    connect();

    return () => disconnect();
  }, []);

  useEffect(() => {
    if (isRefresh) {
      connect();
    }
  }, [isRefresh]);

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
    <View style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={-insets.bottom}>
        <View style={{position: 'absolute', width: '100%', zIndex: 5}}>
          <BlurView
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
            <View style={{marginLeft: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CustomText
                  fontWeight="600"
                  style={{fontSize: 17, marginRight: 3}}>
                  {data?.result.name}
                </CustomText>
                <OfficialSvg width={15} height={15} />
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CustomText
                  style={{
                    color: '#626262',
                  }}>{`${data.result.count}명`}</CustomText>
                <View
                  style={{
                    width: 1,
                    height: 9,
                    backgroundColor: '#626262',
                    marginHorizontal: 4,
                  }}
                />
                <CustomText style={{color: '#626262', marginRight: 2}}>
                  커뮤니티 바로가기
                </CustomText>
                <ChevronRightSvg width={9} height={9} />
              </View>
            </View>
          </BlurView>
          <View
            style={{
              marginTop: 5,
              marginHorizontal: 10,
              borderRadius: 10,
              backgroundColor: 'white',
              paddingVertical: 10,
              paddingHorizontal: 15,
              shadowColor: '#000000',
              shadowOffset: {
                width: 3,
                height: 3,
              },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: '#eeeeee',
            }}>
            <MegaphoneSvg width={20} height={20} style={{marginTop: 2}} />
            <CustomText
              style={{color: '#484848', fontSize: 15, marginLeft: 10}}>
              {data?.result.description}
            </CustomText>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          contentContainerStyle={{
            paddingTop: insets.top + 110,
            paddingHorizontal: 15,
          }}
          data={messages}
          renderItem={renderChatMessage}
          keyExtractor={(item, index) => index.toString()}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={() => {
            if (isAtBottom) {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({animated: true});
              }, 0);
            }
          }}
          onLayout={() => {
            flatListRef.current?.scrollToEnd({animated: true});
          }}
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
                flatListRef.current?.scrollToEnd({animated: true});
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
    </View>
  );
};

export default ChatRoomScreen;
