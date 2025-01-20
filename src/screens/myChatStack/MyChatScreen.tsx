import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, ListRenderItem, StatusBar, View} from 'react-native';
import {SafeAreaView} from 'react-native';
import {
  useGetMyChatRooms,
  useGetMyOfficialChatRooms,
} from '../../apis/chat/useChats';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ChatRoom} from '../../apis/chat/types';
import ChatCard from 'components/common/ChatCard';
import StackHeader from 'components/common/StackHeader';
import Carousel, {
  CarouselRenderItem,
  Pagination,
} from 'react-native-reanimated-carousel';
import {WINDOW_WIDTH} from 'constants/dimension';
import CustomText from 'components/common/CustomText';
import {
  Extrapolation,
  interpolate,
  useSharedValue,
} from 'react-native-reanimated';
import {PanGesture} from 'react-native-gesture-handler';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MyChatStackParamList} from 'navigations/MyChatStackNavigator';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useWebSocket} from 'context/useWebSocket';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';
import {queryClient} from '../../../App';
import {chatKeys, chatRoomKeys} from 'apis/chat/queries';
import {useIsMutating} from '@tanstack/react-query';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';

const MyChatScreen = () => {
  useDarkStatusBar();
  const navigation =
    useNavigation<NativeStackNavigationProp<MyChatStackParamList>>();
  const {stompClient, isConnected} = useWebSocket();
  const insets = useSafeAreaInsets();

  const [chatRoomData, setChatRoomData] = useState<ChatRoom[]>([]);
  const subscriptionsRef = useRef<{[key: number]: any}>({});

  const paginationProgress = useSharedValue<number>(0);

  const {data: officials} = useGetMyOfficialChatRooms();
  const {data: publics, refetch} = useGetMyChatRooms();
  const isMutating = useIsMutating();

  const handleConfigurePanGesture = (panGesture: PanGesture) => {
    panGesture.activeOffsetX([-10, 10]);
    panGesture.failOffsetY([-15, 15]);
  };

  const renderOfficial: CarouselRenderItem<ChatRoom> = useCallback(
    ({item}) => {
      return (
        <ChatCard
          chatRoom={item}
          location="MY"
          onPress={() => {
            navigation.navigate('CommunityStack', {
              screen: 'ChatRoom',
              params: {chatRoomId: item.id, type: 'OFFICIAL'},
            });
          }}
        />
      );
    },
    [navigation],
  );

  const renderChatRoom: ListRenderItem<ChatRoom> = useCallback(
    ({item}) => {
      return (
        <ChatCard
          key={item.id}
          location="MY"
          chatRoom={item}
          onPress={() => {
            navigation.navigate('CommunityStack', {
              screen: 'ChatRoom',
              params: {chatRoomId: item.id, type: 'PUBLIC'},
            });
          }}
        />
      );
    },
    [navigation],
  );

  useEffect(() => {
    if (officials) {
      officials.forEach(chatRoom => {
        queryClient.setQueryData(chatRoomKeys.detail(chatRoom.id), chatRoom);
      });
    }
  }, [officials]);

  useEffect(() => {
    if (publics) {
      setChatRoomData(publics);
      publics.forEach(chatRoom => {
        queryClient.setQueryData(chatRoomKeys.detail(chatRoom.id), chatRoom);
      });
    }
  }, [publics]);

  useFocusEffect(
    useCallback(() => {
      const client = stompClient.current;

      const subscribeToChatRooms = async () => {
        const accessToken = await EncryptedStorage.getItem('accessToken');
        if (client && isConnected && accessToken && publics) {
          publics.forEach(chatRoom => {
            const subscription = client.subscribe(
              `/topic/chatRoom/${chatRoom.id}`,
              message => {
                const res = JSON.parse(message.body);

                setChatRoomData(prevChatRooms => {
                  const updatedChatRooms = prevChatRooms.map(room => {
                    if (room.id === chatRoom.id) {
                      return {
                        ...room,
                        lastMessage: res.content,
                        lastMessageTime: res.createdAt,
                        unreadCount: (room.unreadCount ?? 0) + 1,
                      };
                    }
                    return room;
                  });

                  const updatedChatRoom = updatedChatRooms.find(
                    room => room.id === chatRoom.id,
                  );
                  const remainingChatRooms = updatedChatRooms.filter(
                    room => room.id !== chatRoom.id,
                  );

                  if (updatedChatRoom) {
                    return [updatedChatRoom, ...remainingChatRooms];
                  }

                  return updatedChatRooms;
                });
              },
              {
                Authorization: `Bearer ${accessToken}`,
              },
            );
            subscriptionsRef.current[chatRoom.id] = subscription;
          });
        }
      };
      subscribeToChatRooms();
    }, [isConnected, publics, stompClient]),
  );

  useFocusEffect(
    useCallback(() => {
      const client = stompClient.current;
      return () => {
        if (client && isConnected) {
          publics?.forEach(chatRoom => {
            const subscription = subscriptionsRef.current[chatRoom.id];
            if (subscription) {
              subscription.unsubscribe();
              delete subscriptionsRef.current[chatRoom.id];
            }
          });
        }
      };
    }, [isConnected, publics, stompClient]),
  );

  useFocusEffect(
    useCallback(() => {
      if (!isMutating) {
        refetch();
        queryClient.refetchQueries({queryKey: chatKeys.isUnread()});
      }
    }, [refetch, isMutating]),
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <StackHeader title="내 채팅" type="none" />
      <FlatList
        data={chatRoomData}
        renderItem={renderChatRoom}
        contentContainerStyle={{paddingBottom: insets.bottom + 100}}
        ListHeaderComponent={
          <View>
            {officials && officials.length !== 0 ? (
              <>
                <CustomText fontWeight="600" className="text-lg mt-2 mx-3 mb-1">
                  대표 채팅방
                </CustomText>
                <Carousel
                  onConfigurePanGesture={handleConfigurePanGesture}
                  loop={false}
                  data={officials}
                  renderItem={renderOfficial}
                  width={WINDOW_WIDTH}
                  mode="parallax"
                  height={93}
                  onProgressChange={paginationProgress}
                  modeConfig={{
                    parallaxScrollingScale: 0.87,
                    parallaxScrollingOffset: 62,
                  }}
                />
                <Pagination.Custom
                  progress={paginationProgress}
                  data={officials}
                  size={20}
                  dotStyle={{
                    width: 5,
                    height: 5,
                    borderRadius: 100,
                    backgroundColor: '#d7d7d7',
                  }}
                  activeDotStyle={{
                    borderRadius: 100,
                    width: 7,
                    height: 7,
                    overflow: 'hidden',
                    backgroundColor: '#383838',
                  }}
                  containerStyle={{
                    gap: 8,
                    alignItems: 'center',
                    height: 10,
                  }}
                  horizontal
                  customReanimatedStyle={(progress, index, length) => {
                    let val = Math.abs(progress - index);
                    if (index === 0 && progress > length - 1) {
                      val = Math.abs(progress - length);
                    }

                    return {
                      transform: [
                        {
                          translateY: interpolate(
                            val,
                            [0, 1],
                            [0, 0],
                            Extrapolation.CLAMP,
                          ),
                        },
                      ],
                    };
                  }}
                />
              </>
            ) : null}
            <CustomText fontWeight="600" className="text-lg mt-2 mx-3 mb-2">
              일반 채팅방
            </CustomText>
          </View>
        }
        ListEmptyComponent={publics ? <ListEmpty type="myChat" /> : <></>}
      />
    </SafeAreaView>
  );
};

export default MyChatScreen;
