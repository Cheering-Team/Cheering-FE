import React, {useEffect} from 'react';
import {useGetNotifications} from '../../apis/notification/useNotifications';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  Pressable,
  View,
} from 'react-native';
import {Notification} from '../../apis/notification/types';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Avatar from '../../components/common/Avatar';
import CustomText from '../../components/common/CustomText';

const NotificationScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const {data, isLoading} = useGetNotifications();

  const renderNotification: ListRenderItem<Notification> = ({item}) => {
    return (
      <Pressable
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
        }}
        onPress={() =>
          navigation.navigate('CommunityStack', {
            screen: 'Post',
            params: {postId: item.post.id},
          })
        }>
        <Avatar uri={item.from.image} size={43} />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            marginLeft: 10,
          }}>
          <CustomText style={{flex: 1, color: '#282828'}}>
            <CustomText fontWeight="500">{item.from.nickname}</CustomText>
            {item.count > 1
              ? `님 외 ${item.count - 1}명이 회원님의 게시글을 좋아합니다.`
              : '님이 회원님의 게시글을 좋아합니다.'}
          </CustomText>
        </View>

        {item.post.image && (
          <Image
            source={{uri: item.post.image.url}}
            style={{width: 45, height: 45, borderRadius: 10, marginLeft: 10}}
          />
        )}
      </Pressable>
    );
  };

  if (isLoading) {
    return <ActivityIndicator size={'large'} style={{marginTop: insets.top}} />;
  }
  return (
    <FlatList
      data={data?.pages.flatMap(page => page.result.notifications)}
      renderItem={renderNotification}
    />
  );
};

export default NotificationScreen;
