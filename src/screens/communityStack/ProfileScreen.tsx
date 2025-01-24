import React, {useRef, useState} from 'react';
import {Dimensions, Pressable, RefreshControl, View} from 'react-native';
import Avatar from '../../components/common/Avatar';
import CustomText from '../../components/common/CustomText';
import FeedPost from '../../components/community/FeedPost';
import OptionModal from '../../components/common/OptionModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

import {useGetFanPosts} from '../../apis/post/usePosts';
import AlertModal from 'components/common/AlertModal/AlertModal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FeedSkeleton from 'components/skeleton/FeedSkeleton';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CommunityStackParamList} from 'navigations/authSwitch/mainTab/CommunityStackNavigator';
import Viewer from 'components/post/Viewer';
import NotFound from 'components/notfound';
import {useBlockUser, useGetFanInfo} from 'apis/fan/useFans';
import {useDarkStatusBar} from 'hooks/useDarkStatusBar';
import CCHeader from 'components/common/CCHeader';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

const ProfileScreen = () => {
  useDarkStatusBar();
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const {fanId} =
    useRoute<RouteProp<CommunityStackParamList, 'Profile'>>().params;
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const {data: profile, isLoading, isError, error} = useGetFanInfo(fanId);
  const {mutate: blockUser} = useBlockUser();

  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useGetFanPosts(fanId);

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

  if (isLoading) {
    return null;
  }

  if (isError && error.message === '존재하지 않는 팬') {
    return <NotFound type="FAN" />;
  }

  if (profile) {
    return (
      <View style={{flex: 1}}>
        <CCHeader
          scrollY={scrollY}
          onFirstPress={() => {
            navigation.goBack();
          }}
          secondType="MORE"
          onSecondPress={
            profile.isUser
              ? () => bottomSheetModalRef.current?.present()
              : undefined
          }
        />
        <Animated.FlatList
          showsVerticalScrollIndicator={true}
          onScroll={scrollHandler}
          contentContainerStyle={{
            paddingTop: insets.top + 45,
            paddingBottom: 50,
          }}
          ListHeaderComponent={
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: '#efefef',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 22,
                  alignItems: 'center',
                }}>
                <Pressable onPress={() => setIsViewerOpen(true)}>
                  <Avatar uri={profile.image} size={68} />
                </Pressable>
                <View style={{marginLeft: 15, marginTop: 3}}>
                  <CustomText fontWeight="500" style={{fontSize: 22}}>
                    {profile.name}
                  </CustomText>
                </View>
              </View>
              <View style={{paddingHorizontal: 20}}>
                {profile.isUser ? (
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
                        fanId: fanId,
                        type: 'COMMUNITY',
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
          data={posts?.pages.flatMap(page => page.posts)}
          renderItem={({item}) => (
            <Pressable
              key={item.id}
              onPress={() => {
                navigation.navigate('Post', {
                  postId: item.id,
                });
              }}>
              <FeedPost feed={item} type="community" />
            </Pressable>
          )}
          onEndReached={loadFeed}
          onEndReachedThreshold={1}
          ListFooterComponent={
            isFetchingNextPage ? <FeedSkeleton type="Community" /> : null
          }
          ListEmptyComponent={
            !posts ? (
              <FeedSkeleton type="Community" />
            ) : (
              <View
                style={{
                  height: Dimensions.get('window').height * 0.3 + 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <CustomText
                  fontWeight="600"
                  className="text-base mb-[5] text-gray-800"
                  style={{fontSize: 16, marginBottom: 5}}>
                  작성한 게시글이 없어요
                </CustomText>
              </View>
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
        {profile.isUser && (
          <OptionModal
            modalRef={bottomSheetModalRef}
            firstText="차단한 계정"
            firstSvg="block"
            firstOnPress={() => {
              navigation.navigate('BlockList', {
                playerUserId: fanId,
              });
            }}
            secondText="커뮤니티 탈퇴"
            secondColor="#ff2626"
            secondSvg="exit"
            secondOnPress={() => {
              navigation.navigate('DeleteFan', {
                fanId: fanId,
              });
            }}
          />
        )}
        {!profile.isUser && (
          <AlertModal
            title="사용자를 차단하시겠습니까?"
            content="해당 사용자의 모든 활동이 더이상 보이지 않습니다."
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            button1Text="차단"
            button1Color="#ff2626"
            button2Text="취소"
            button1Press={() => {
              blockUser({fanId: fanId});
            }}
          />
        )}
        <Viewer
          images={[{path: profile.image, type: 'IMAGE'}]}
          isViewerOpen={isViewerOpen}
          setIsViewerOpen={setIsViewerOpen}
          viewIndex={0}
        />
      </View>
    );
  }
};

export default ProfileScreen;
