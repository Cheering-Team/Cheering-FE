import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  SectionList,
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
import StackHeader from 'components/common/StackHeader';

const MyChatScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const sectionListRef = useRef<SectionList<ChatRoom>>(null);

  const {data, isLoading, refetch} = useGetMyChatRooms();

  useScrollToTop(
    useRef({
      scrollToTop: () => {
        sectionListRef.current?.scrollToLocation({
          sectionIndex: 0,
          itemIndex: 0,
          animated: true,
        });
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
          item.type === 'OFFICIAL' || item.isParticipating
            ? navigation.navigate('CommunityStack', {
                screen: 'ChatRoom',
                params: {chatRoomId: item.id},
              })
            : navigation.navigate('CommunityStack', {
                screen: 'ChatRoomEnter',
                params: {chatRoomId: item.id},
              });
        }}
      />
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StackHeader title="내 채팅" type="none" />
      {data ? (
        <SectionList
          ref={sectionListRef}
          sections={data.result}
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
          renderSectionFooter={({section: {title}}) => {
            if (title === 'official') {
              return <View className="h-[1] mx-3 bg-gray-100 my-[2]" />;
            } else {
              return null;
            }
          }}
        />
      ) : (
        <ActivityIndicator style={{marginTop: insets.top}} />
      )}
    </SafeAreaView>
  );
};

export default MyChatScreen;
