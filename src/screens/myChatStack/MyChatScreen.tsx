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
      <Pressable
        style={{
          flexDirection: 'row',
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}
        onPress={() =>
          navigation.navigate('CommunityStack', {
            screen: 'ChatRoom',
            params: {chatRoomId: item.id},
          })
        }>
        <Avatar uri={item.image} size={55} style={{marginTop: 2}} />
        <View style={{marginLeft: 12}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText
              fontWeight="500"
              style={{fontSize: 16, marginRight: 2, paddingBottom: 0}}>
              {item.name}
            </CustomText>
            <OfficialSvg width={17} height={17} />
          </View>
          <CustomText style={{color: '#8a8a8a'}}>{item.description}</CustomText>
          <CustomText
            fontWeight="500"
            style={{
              color: '#4e4e4e',
              fontSize: 12,
            }}>{`${item.count}명`}</CustomText>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          height: 52,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#eeeeee',
        }}>
        <CustomText fontWeight="500" style={{fontSize: 20, paddingBottom: 0}}>
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
