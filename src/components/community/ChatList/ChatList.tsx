import {ChatRoom} from 'apis/chat/types';
import {useGetChatRooms, useGetOfficialChatRoom} from 'apis/chat/useChats';
import {Community} from 'apis/community/types';
import ChatCard from 'components/common/ChatCard';
import CustomText from 'components/common/CustomText';
import {WINDOW_HEIGHT} from 'constants/dimension';
import React, {MutableRefObject, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import SearchSvg from 'assets/images/search-sm.svg';
import SortSvg from 'assets/images/sort.svg';
import {debounce} from 'lodash';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/CommunityStackNavigator';
import PlusSvg from 'assets/images/plus-white.svg';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';
import ChatRoomSkeleton from 'components/skeleton/ChatRoomSkeleton';
import {queryClient} from '../../../../App';
import {chatKeys, chatRoomKeys} from 'apis/chat/queries';

const HEADER_HEIGHT = WINDOW_HEIGHT / 2;

interface ChatListProps {
  scrollY: SharedValue<number>;
  isTabFocused: boolean;
  onMomentumScrollBegin: () => void;
  onMomentumScrollEnd: () => void;
  onScrollEndDrag: () => void;
  listArrRef: MutableRefObject<
    {
      key: string;
      value: FlatList<ChatRoom> | ScrollView | null;
    }[]
  >;
  tabRoute: {
    key: string;
    title: string;
  };
  community: Community;
}

const ChatList = ({
  scrollY,
  isTabFocused,
  onMomentumScrollBegin,
  listArrRef,
  tabRoute,
  onMomentumScrollEnd,
  onScrollEndDrag,
  community,
}: ChatListProps) => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();

  const [sortBy, setSortBy] = useState<'participants' | 'createdAt'>(
    'participants',
  );
  const [name, setName] = useState<string>('');
  const debouncedSetName = debounce(setName, 300);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const buttonOpacity = useSharedValue(1);

  const {data: officialChatRoom, refetch: refetchOfficial} =
    useGetOfficialChatRoom(community.id, community.curFan !== null);
  const {
    data: chatRooms,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetChatRooms(community.id, sortBy, name, community.curFan !== null);

  const loadChatRooms = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const scrollHandler = useAnimatedScrollHandler(event => {
    if (isTabFocused) {
      scrollY.value = event.contentOffset.y;
    }
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch();
    refetchOfficial();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    if (officialChatRoom) {
      queryClient.setQueryData(
        chatRoomKeys.detail(officialChatRoom.id),
        officialChatRoom,
      );
    }
  }, [officialChatRoom]);

  useEffect(() => {
    if (chatRooms) {
      chatRooms.pages
        .flatMap(page => page.chatRooms)
        .forEach(chatRoom => {
          queryClient.setQueryData(chatRoomKeys.detail(chatRoom.id), chatRoom);
        });
    }
  }, [chatRooms]);

  return (
    <View className="flex-1">
      <Animated.FlatList
        ref={ref => {
          const foundIndex = listArrRef.current.findIndex(
            e => e.key === tabRoute.key,
          );

          if (foundIndex === -1) {
            listArrRef.current.push({
              key: tabRoute.key,
              value: ref,
            });
          } else {
            listArrRef.current[foundIndex] = {
              key: tabRoute.key,
              value: ref,
            };
          }
        }}
        data={chatRooms?.pages.flatMap(page => page.chatRooms) || []}
        renderItem={({item}) => (
          <ChatCard
            chatRoom={item}
            location="COMMUNITY"
            onPress={() => {
              item.isParticipating
                ? navigation.navigate('ChatRoom', {chatRoomId: item.id})
                : navigation.navigate('ChatRoomEnter', {chatRoomId: item.id});
            }}
          />
        )}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT,
          minHeight: WINDOW_HEIGHT + HEADER_HEIGHT - 45,
          paddingHorizontal: 10,
          paddingBottom: insets.bottom + 100,
        }}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onMomentumScrollBegin={() => {
          buttonOpacity.value = withTiming(0.2, {duration: 150});
          onMomentumScrollBegin();
        }}
        onMomentumScrollEnd={() => {
          buttonOpacity.value = withTiming(1, {duration: 300});
          onMomentumScrollEnd();
        }}
        onScrollEndDrag={onScrollEndDrag}
        ListHeaderComponent={
          <View>
            <CustomText
              type="titleCenter"
              className="text-[22px] mt-3 ml-1 mb-3">
              대표 채팅방
            </CustomText>
            {officialChatRoom && (
              <ChatCard
                chatRoom={officialChatRoom}
                location="COMMUNITY"
                onPress={() =>
                  navigation.navigate('ChatRoom', {
                    chatRoomId: officialChatRoom.id,
                  })
                }
              />
            )}
            <View>
              <View className="flex-row justify-between items-center">
                <CustomText
                  type="titleCenter"
                  className="text-[22px] mt-5 ml-1">
                  일반 채팅방
                </CustomText>
                <Pressable
                  className="flex-row items-center mr-[10] mt-3"
                  onPress={() =>
                    setSortBy(prev =>
                      prev === 'createdAt' ? 'participants' : 'createdAt',
                    )
                  }>
                  <SortSvg width={12} height={12} />
                  <CustomText
                    className="ml-1 text-base text-gray-600"
                    fontWeight="600">
                    {sortBy === 'participants' ? '인기순' : '최신순'}
                  </CustomText>
                </Pressable>
              </View>
              <View
                className="bg-gray-100 flex-row px-3 rounded-2xl mx-1 items-center mb-3 mt-3"
                style={{paddingVertical: Platform.OS === 'ios' ? 9 : 5}}>
                <SearchSvg width={20} height={20} />
                <TextInput
                  className="flex-1 p-0 m-0 ml-[6]"
                  placeholder="채팅방 검색"
                  onChangeText={debouncedSetName}
                  style={{
                    fontFamily: 'Pretendard-Regular',
                    paddingBottom: 1,
                    fontSize: 16,
                    includeFontPadding: false,
                  }}
                />
              </View>
            </View>
          </View>
        }
        onEndReached={community.curFan && loadChatRooms}
        onEndReachedThreshold={community.curFan && 1}
        ListEmptyComponent={
          isLoading ? <ChatRoomSkeleton /> : <ListEmpty type="chat" />
        }
        ListFooterComponent={
          isFetchingNextPage && community.curFan ? <ActivityIndicator /> : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            progressViewOffset={-20}
            colors={['#787878']}
          />
        }
      />

      <Animated.View style={{opacity: buttonOpacity}}>
        <Pressable
          onPress={() => navigation.navigate('CreateChatRoom', {community})}
          className="absolute p-[12] rounded-full z-50"
          style={{
            backgroundColor: community.color,
            bottom: insets.bottom + 57,
            right: 12,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.3,
            shadowRadius: 2,
          }}>
          <PlusSvg width={21} height={21} />
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default ChatList;
