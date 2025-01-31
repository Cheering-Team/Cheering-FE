import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useGetPrivateChatRoomIdsForManager} from 'apis/chat/useChats';
import CCHeader from 'components/common/CCHeader';
import ChatCard from 'components/common/ChatCard';
import ListEmpty from 'components/common/ListEmpty/ListEmpty';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsMutating} from '@tanstack/react-query';

const MeetPrivateChatListScreen = () => {
  const {meetId, community} =
    useRoute<RouteProp<CommunityStackParamList, 'MeetPrivateChatList'>>()
      .params;
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const insets = useSafeAreaInsets();

  const {
    data: chatRooms,
    isLoading,
    refetch,
  } = useGetPrivateChatRoomIdsForManager(meetId);
  const isMutating = useIsMutating();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (!isMutating) {
        refetch();
      }
    }, [refetch, isMutating]),
  );

  return (
    <View className="flex-1">
      <CCHeader
        title="신청 목록"
        scrollY={scrollY}
        community={community}
        onFirstPress={() => {
          navigation.goBack();
        }}
      />
      <Animated.FlatList
        data={chatRooms || []}
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingTop: insets.top + 55 + 5,
        }}
        renderItem={({item}) => (
          <ChatCard
            chatRoom={item}
            location="MY"
            onPress={() => {
              navigation.navigate('ChatRoom', {
                chatRoomId: item.id,
                type: 'PRIVATE',
              });
            }}
          />
        )}
        ListEmptyComponent={isLoading ? null : <ListEmpty type="meetPrivate" />}
      />
    </View>
  );
};

export default MeetPrivateChatListScreen;
