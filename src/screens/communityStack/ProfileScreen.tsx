import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  View,
} from 'react-native';
import CloseSvg from '../../../assets/images/close-black.svg';
import MoreSvg from '../../../assets/images/three-dots-black.svg';
import {FlatList} from 'react-native-gesture-handler';
import Avatar from '../../components/common/Avatar';
import CustomText from '../../components/common/CustomText';
import FeedPost from '../../components/community/FeedPost';
import OptionModal from '../../components/common/OptionModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useBlockUser, useGetPlayerUserInfo} from '../../apis/player/usePlayers';
import {useGetPlayerUserPosts} from '../../apis/post/usePosts';
import AlertModal from 'components/common/AlertModal/AlertModal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ProfileScreen = ({navigation, route}) => {
  const {playerUserId} = route.params;
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {data} = useGetPlayerUserInfo(playerUserId);
  const {mutate: blockUser} = useBlockUser();

  const {
    data: feedData,
    isLoading: feedIsLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useGetPlayerUserPosts(playerUserId);

  const loadFeed = () => {
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

  if (!data) {
    return null;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 45,
          paddingLeft: 8,
          paddingRight: 11,
          marginTop: Platform.OS === 'android' ? insets.top : undefined,
        }}>
        <Pressable onPress={() => navigation.goBack()}>
          <CloseSvg width={30} height={30} />
        </Pressable>
        <View style={{flexDirection: 'row'}}>
          <CustomText
            fontWeight="500"
            style={{
              fontSize: 17,
            }}>
            {data.result.player.koreanName}
          </CustomText>
          {data.result.player.englishName.length < 20 && (
            <CustomText
              fontWeight="500"
              style={{
                fontSize: 17,
              }}>
              {` / ${data.result.player.englishName}`}
            </CustomText>
          )}
        </View>
        {data.result.isUser ? (
          <Pressable onPress={() => bottomSheetModalRef.current?.present()}>
            <MoreSvg width={18} height={18} />
          </Pressable>
        ) : (
          <View style={{width: 18, height: 18}} />
        )}
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        ListHeaderComponent={
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: '#efefef',
            }}>
            <View
              style={{flexDirection: 'row', padding: 22, alignItems: 'center'}}>
              <Avatar uri={data.result.user.image} size={68} />
              <View style={{marginLeft: 15, marginTop: 3}}>
                <CustomText fontWeight="500" style={{fontSize: 22}}>
                  {data.result.user.nickname}
                </CustomText>
              </View>
            </View>
            <View style={{paddingHorizontal: 20}}>
              {data.result.isUser ? (
                <Pressable
                  style={{
                    borderWidth: 1,
                    borderColor: '#d6d6d6',
                    height: 40,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}
                  onPress={() =>
                    navigation.navigate('ProfileEdit', {
                      playerUserId: data.result.user.id,
                    })
                  }>
                  <CustomText fontWeight="500" style={{fontSize: 16}}>
                    프로필 편집
                  </CustomText>
                </Pressable>
              ) : (
                <Pressable
                  style={{
                    borderWidth: 1,
                    borderColor: '#fe9393',
                    height: 40,
                    borderRadius: 7,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}
                  onPress={() => {
                    setIsModalOpen(true);
                  }}>
                  <CustomText
                    fontWeight="500"
                    className="text-base text-red-500">
                    차단하기
                  </CustomText>
                </Pressable>
              )}
            </View>
          </View>
        }
        data={feedData?.pages.flatMap(page => page.result.posts)}
        renderItem={({item}) => (
          <Pressable
            key={item.id}
            onPress={() => {
              navigation.navigate('Post', {
                postId: item.id,
                playerUser: item.playerUser,
              });
            }}>
            <FeedPost feed={item} type="community" />
          </Pressable>
        )}
        onEndReached={loadFeed}
        onEndReachedThreshold={1}
        ListFooterComponent={
          feedIsLoading || isFetchingNextPage ? (
            <View
              style={{
                height: Dimensions.get('window').height * 0.3 + 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size={'large'} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !feedIsLoading ? (
            <View
              style={{
                height: Dimensions.get('window').height * 0.3 + 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <CustomText
                fontWeight="600"
                style={{fontSize: 23, marginBottom: 5}}>
                아직 게시글이 없어요
              </CustomText>
              <CustomText style={{color: '#5b5b5b'}}>
                가장 먼저 게시글을 작성해보세요
              </CustomText>
            </View>
          ) : (
            <></>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            progressViewOffset={10}
            colors={['#787878']}
          />
        }
      />
      {data.result.isUser && (
        <OptionModal
          modalRef={bottomSheetModalRef}
          firstText="차단한 계정"
          firstSvg="block"
          firstOnPress={() => {
            navigation.navigate('BlockList', {
              playerUserId,
            });
          }}
          secondText="커뮤니티 탈퇴"
          secondColor="#ff2626"
          secondSvg="exit"
          secondOnPress={() => {
            navigation.navigate('DeletePlayerUser', {
              playerUserId,
            });
          }}
        />
      )}
      {!data.result.isUser && (
        <AlertModal
          title="사용자를 차단하시겠습니까?"
          content="해당 사용자의 모든 활동이 더이상 보이지 않습니다."
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          button1Text="차단"
          button1Color="#ff2626"
          button2Text="취소"
          button1Press={() => {
            blockUser({playerUserId});
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
