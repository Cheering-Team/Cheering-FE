import React from 'react';
import {ListRenderItem, View} from 'react-native';
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

const HomeScreen = () => {
  const insets = useSafeAreaInsets();

  const scrollY = useSharedValue(0);
  const translateY = useSharedValue(0);

  const {data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage} =
    useGetPosts(0, 'all', true);

  const renderFeed: ListRenderItem<PostInfoResponse> = ({item}) => (
    <FeedPost feed={item} postId={item.id} type="home" />
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
    <View style={{flex: 1}}>
      <HomeHeader translateY={translateY} />
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
                paddingHorizontal: 16,
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
  );
};

export default HomeScreen;
