import React, {useEffect, useRef, useState} from 'react';
import {useGetNotifications} from '../../apis/notification/useNotifications';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  Pressable,
  RefreshControl,
  SafeAreaView,
  View,
} from 'react-native';
import {Notification} from '../../apis/notification/types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Avatar from '../../components/common/Avatar';
import CustomText from '../../components/common/CustomText';
import {useIsFocused, useScrollToTop} from '@react-navigation/native';
import {queryClient} from '../../../App';
import {notificationKeys} from '../../apis/notification/queries';
import ListLoading from '../../components/common/ListLoading/ListLoading';
import ListEmpty from '../../components/common/ListEmpty/ListEmpty';
import {formatBeforeDate} from '../../utils/format';

const NotificationScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useScrollToTop(
    useRef({
      scrollToTop: () => {
        flatListRef.current?.scrollToOffset({offset: 0, animated: true});
        handleRefresh();
      },
    }),
  );

  const {
    data,
    isLoading,
    refetch,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetNotifications();

  const renderNotification: ListRenderItem<Notification> = ({item}) => {
    return (
      <Pressable
        style={{
          flexDirection: 'row',
          padding: 10,
          backgroundColor: item.isRead ? '#f7f7f7' : 'white',
        }}
        onPress={() =>
          navigation.navigate('CommunityStack', {
            screen: 'Post',
            params: {postId: item.post.id},
          })
        }>
        <Avatar uri={item.from.image} size={43} />
        {item.type === 'LIKE' ? (
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              marginLeft: 10,
              marginTop: 3,
            }}>
            <CustomText
              style={{flex: 1, color: '#282828'}}
              numberOfLines={3}
              ellipsizeMode="tail">
              <CustomText fontWeight="500">{item.from.nickname}</CustomText>
              {item.count > 1
                ? `님 외 ${item.count - 1}명이 회원님의 게시글을 좋아합니다.`
                : '님이 회원님의 게시글을 좋아합니다.  '}
              <CustomText style={{color: '#a2a2a2'}}>
                {formatBeforeDate(item.createdAt)}
              </CustomText>
            </CustomText>
          </View>
        ) : item.type === 'COMMENT' ? (
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              marginLeft: 10,
              marginTop: 3,
            }}>
            <CustomText
              style={{flex: 1, color: '#282828'}}
              numberOfLines={3}
              ellipsizeMode="tail">
              <CustomText fontWeight="500">{item.from.nickname}</CustomText>
              {`님이 댓글을 남겼습니다: `}
              <CustomText fontWeight="500">{`${item.content}  `}</CustomText>
              <CustomText style={{color: '#a2a2a2'}}>
                {formatBeforeDate(item.createdAt)}
              </CustomText>
            </CustomText>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              marginLeft: 10,
              marginTop: 3,
            }}>
            <CustomText
              style={{flex: 1, color: '#282828'}}
              numberOfLines={3}
              ellipsizeMode="tail">
              <CustomText fontWeight="500">{item.from.nickname}</CustomText>
              {`님이 답글을 남겼습니다: `}
              <CustomText
                fontWeight="500"
                style={{
                  color: '#939393',
                }}>{`@${item.to.nickname} `}</CustomText>
              <CustomText fontWeight="500">{`${item.content}  `}</CustomText>
              <CustomText style={{color: '#a2a2a2'}}>
                {formatBeforeDate(item.createdAt)}
              </CustomText>
            </CustomText>
          </View>
        )}

        {item.post.image && (
          <Image
            source={{uri: item.post.image.url}}
            style={{width: 45, height: 45, borderRadius: 10, marginLeft: 10}}
          />
        )}
      </Pressable>
    );
  };

  const loadNotifications = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetch();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    const fetchNotification = async () => {
      await refetch();
      queryClient.invalidateQueries({queryKey: notificationKeys.isUnread()});
    };

    if (isFocused) {
      fetchNotification();
    }
  }, [isFocused, refetch]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View className="h-[48] flex-row justify-center items-center bg-white border-b border-b-[#eeeeee]">
        <CustomText fontWeight="500" className="text-lg pb-0">
          알림
        </CustomText>
      </View>
      {data ? (
        <FlatList
          ref={flatListRef}
          data={data.pages.flatMap(page => page.result.notifications)}
          renderItem={renderNotification}
          contentContainerStyle={{paddingBottom: insets.bottom + 50}}
          onEndReached={loadNotifications}
          onEndReachedThreshold={1}
          ListFooterComponent={isFetchingNextPage ? <ListLoading /> : null}
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

export default NotificationScreen;
