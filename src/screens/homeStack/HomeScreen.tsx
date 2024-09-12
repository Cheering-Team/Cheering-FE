import React, {useRef, useState} from 'react';
import {FlatList, ListRenderItem, Pressable, View} from 'react-native';
import HomeBanner from '../../components/home/HomeBanner';
import HomeHeader from '../../components/home/HomeHeader';
import CustomText from '../../components/common/CustomText';
import {useGetPosts} from '../../apis/post/usePosts';
import {PostInfoResponse} from '../../types/post';
import FeedPost from '../../components/community/FeedPost';
import ListLoading from '../../components/common/ListLoading/ListLoading';
import ListEmpty from '../../components/common/ListEmpty/ListEmpty';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Drawer} from 'react-native-drawer-layout';
import {useGetMyPlayers} from '../../apis/player/usePlayers';
import {useNavigation} from '@react-navigation/native';
import Avatar from '../../components/common/Avatar';
import ChevronDownSvg from '../../../assets/images/chevron-down-black-thin.svg';
import StarSvg from '../../../assets/images/star-gray.svg';
import OptionModal from '../../components/common/OptionModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {Player} from '../../apis/player/types';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const scrollY = useSharedValue(0);
  const translateY = useSharedValue(0);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const {data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage} =
    useGetPosts(0, 'all', true);

  const {data: playerData} = useGetMyPlayers();

  const renderFeed: ListRenderItem<PostInfoResponse> = ({item}) => (
    <FeedPost feed={item} type="home" />
  );

  const loadFeed = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const calcTranslateY = (curOffsetY: number, lastScrollY: number) => {
    'worklet';
    if (curOffsetY > lastScrollY) {
      if (curOffsetY < 53) {
        return translateY.value;
      }
      if (-translateY.value >= 53) {
        return -53;
      }
      return translateY.value - (curOffsetY - lastScrollY);
    }

    if (translateY.value + (lastScrollY - curOffsetY) > 0) {
      return 0;
    }

    return translateY.value + (lastScrollY - curOffsetY);
  };

  const handleScroll = useAnimatedScrollHandler(event => {
    const offsetY = event.contentOffset.y;
    const contentHeight = event.contentSize.height;
    const layoutHeight = event.layoutMeasurement.height;

    const lastScrollY = scrollY.value;

    if (offsetY <= 0) {
      scrollY.value = offsetY;
      return;
    }

    if (contentHeight / layoutHeight <= 1) {
      if (offsetY > 0) {
        scrollY.value = offsetY;
        return;
      }
    } else if (offsetY > contentHeight - layoutHeight) {
      scrollY.value = offsetY;
      return;
    }

    scrollY.value = offsetY;
    translateY.value = calcTranslateY(offsetY, lastScrollY);
    return;
  });

  return (
    <Drawer
      open={isDrawerOpen}
      onOpen={() => setIsDrawerOpen(true)}
      onClose={() => setIsDrawerOpen(false)}
      renderDrawerContent={() => (
        <FlatList
          style={{paddingTop: insets.top}}
          data={playerData?.result}
          ListHeaderComponent={
            <View
              style={{
                height: 53,
                alignItems: 'center',
                paddingHorizontal: 15,
                flexDirection: 'row',
              }}>
              <CustomText
                fontWeight="500"
                style={{fontSize: 18, marginRight: 5}}>
                나의 선수
              </CustomText>
            </View>
          }
          renderItem={({item}) => (
            <Pressable
              style={{
                flexDirection: 'row',
                paddingHorizontal: 17,
                paddingVertical: 10,
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderBottomColor: '#f7f7f7',
              }}
              onPress={() =>
                navigation.navigate('CommunityStack', {
                  screen: 'Community',
                  params: {playerId: item.id},
                })
              }>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Avatar uri={item.image} size={37} />
                <CustomText
                  fontWeight="500"
                  style={{fontSize: 15, marginLeft: 15, color: '#222222'}}>
                  {item.koreanName}
                </CustomText>
              </View>
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#ededed',
                  paddingHorizontal: 9,
                  paddingVertical: 4,
                  borderRadius: 20,
                }}
                onPress={() => {
                  setSelectedPlayer(item);
                  bottomSheetModalRef.current?.present();
                }}>
                <Avatar
                  uri={item.user?.image}
                  size={19}
                  style={{marginRight: 7}}
                />
                <ChevronDownSvg width={12} height={12} />
              </Pressable>
            </Pressable>
          )}
        />
      )}>
      <View style={{flex: 1}}>
        <HomeHeader translateY={translateY} setIsOpen={setIsDrawerOpen} />
        <Animated.FlatList
          style={{paddingTop: insets.top + 53}}
          data={data ? data?.pages.flatMap(page => page.result.posts) : []}
          renderItem={renderFeed}
          ListHeaderComponent={
            <>
              <HomeBanner />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 13,
                  paddingVertical: 7,
                  backgroundColor: 'white',
                  borderBottomWidth: 1,
                  borderColor: '#e7e7e7',
                }}>
                <CustomText
                  fontWeight="500"
                  style={{color: '#686868', fontSize: 15, paddingBottom: 2}}>
                  🔥 실시간 인기 게시글
                </CustomText>
              </View>
            </>
          }
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{paddingBottom: 150}}
          onEndReached={loadFeed}
          onEndReachedThreshold={1}
          ListFooterComponent={isFetchingNextPage ? <ListLoading /> : null}
          ListEmptyComponent={isLoading ? <ListLoading /> : <ListEmpty />}
        />
      </View>
      <OptionModal
        modalRef={bottomSheetModalRef}
        firstText={selectedPlayer?.user?.nickname}
        firstAvatar={selectedPlayer?.user?.image}
        firstOnPress={() => {
          navigation.navigate('CommunityStack', {
            screen: 'Profile',
            params: {playerUserId: selectedPlayer?.user?.id},
          });
        }}
        secondText="커뮤니티 바로가기"
        secondSvg="enter"
        secondOnPress={() => {
          navigation.navigate('CommunityStack', {
            screen: 'Community',
            params: {playerId: selectedPlayer?.id},
          });
        }}
        thirdText="커뮤니티 탈퇴"
        thirdColor="#ff2626"
        thirdSvg="exit"
        thirdOnPress={() => {
          navigation.navigate('CommunityStack', {
            screen: 'DeletePlayerUser',
            params: {playerUserId: selectedPlayer?.user?.id},
          });
        }}
      />
    </Drawer>
  );
};

export default HomeScreen;
