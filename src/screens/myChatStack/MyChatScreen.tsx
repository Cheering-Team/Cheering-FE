import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native';
import CustomText from '../../components/common/CustomText';
import {useGetMyChatRooms} from '../../apis/chat/useChats';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListLoading from '../../components/common/ListLoading/ListLoading';
import ListEmpty from '../../components/common/ListEmpty/ListEmpty';
import {useScrollToTop} from '@react-navigation/native';
import {ChatRoom} from '../../apis/chat/types';
import Avatar from '../../components/common/Avatar';
import OfficialSvg from '../../../assets/images/official.svg';
import ChatCard from 'components/common/ChatCard';

const MyChatScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const {data, isLoading, refetch} = useGetMyChatRooms();

  useScrollToTop(
    useRef({
      scrollToTop: () => {
        flatListRef.current?.scrollToOffset({offset: 0, animated: true});
        handleRefresh();
      },
    }),
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const renderChatRoom: ListRenderItem<ChatRoom> = ({item}) => {
    return (
      <ChatCard
        key={item.id}
        chatRoom={item}
        onPress={() => {
          navigation.navigate('CommunityStack', {
            screen: 'ChatRoom',
            params: {chatRoomId: item.id},
          });
        }}
      />
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View className="h-[48] flex-row justify-center items-center bg-white border-b border-b-[#eeeeee]">
        <CustomText fontWeight="500" className="text-lg pb-0">
          내 채팅
        </CustomText>
      </View>
      {data ? (
        <FlatList
          ref={flatListRef}
          data={data.result}
          renderItem={renderChatRoom}
          contentContainerStyle={{paddingBottom: insets.bottom + 50}}
          onEndReachedThreshold={1}
          ListEmptyComponent={
            isLoading ? <ListLoading /> : <ListEmpty type="notification" />
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      ) : (
        <ActivityIndicator style={{marginTop: insets.top}} />
      )}
    </SafeAreaView>
  );
};

export default MyChatScreen;
