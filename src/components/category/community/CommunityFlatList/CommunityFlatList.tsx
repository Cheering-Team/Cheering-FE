import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Animated, Pressable, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCommunityFlatListHook} from './hooks/useCommunityFlatListHook';
import CommunityHeader from '../CommunityHeader';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {getPosts} from '../../../../apis/post';
import CommunityProfile from '../CommunityProfile';
import CommunityTopTab from '../CommunityTab';
import FeedFilter from '../FeedFilter';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import FeedPost from '../FeedPost';
import NotJoin from '../NotJoin';

interface CommunityFlatListProps {
  playerId: number;
  playerData: any;
  translateY: any;
  setIsModalOpen: any;
  handleScrollBeginDrag: any;
  handleScrollEndDrag: any;
}

const CommunityFlatList = forwardRef((props: CommunityFlatListProps, ref) => {
  const {
    playerId,
    playerData,
    translateY,
    setIsModalOpen,
    handleScrollBeginDrag,
    handleScrollEndDrag,
  } = props;

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const scrollY = useRef(new Animated.Value(0)).current;

  const [selectedFilter, setSelectedFilter] = useState('all');

  const [nativeScrollY, styles, onLayoutHeaderElement, onLayoutStickyElement] =
    useCommunityFlatListHook();

  const {
    data: feedData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', playerId, selectedFilter],
    queryFn: getPosts,
    initialPageParam: 0,
    getNextPageParam: (lastpage, pages) => {
      if (lastpage.result.last) {
        return undefined;
      }
      return pages.length;
    },
  });

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  nativeScrollY.addListener(
    Animated.event([{value: scrollY}], {useNativeDriver: false}),
  );

  const loadFeed = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderFeed = ({item}) => {
    if (playerData.result.user) {
      return (
        <Pressable
          key={item.id}
          onPress={() => {
            navigation.navigate('Post', {postId: item.id});
          }}>
          <FeedPost
            feed={item}
            playerId={playerId}
            postId={item.id}
            selectedFilter={selectedFilter}
          />
        </Pressable>
      );
    } else {
      return (
        <NotJoin
          playerData={playerData}
          setIsModalOpen={setIsModalOpen}
          translateY={translateY}
        />
      );
    }
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <SafeAreaView edges={['bottom']} style={{}}>
      <CommunityHeader playerData={playerData} scrollY={scrollY} />
      <Animated.View
        style={styles.stickyElement}
        onLayout={onLayoutStickyElement}>
        <CommunityTopTab />
      </Animated.View>
      <Animated.FlatList
        ref={ref}
        data={
          playerData.result.user
            ? feedData?.pages.flatMap(page => page.result.posts)
            : [1]
        }
        contentContainerStyle={{paddingBottom: 30}}
        renderItem={renderFeed}
        ListHeaderComponent={
          <Animated.View onLayout={onLayoutHeaderElement}>
            <CommunityProfile playerData={playerData} />
            <FeedFilter
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          </Animated.View>
        }
        ListHeaderComponentStyle={styles.header}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: nativeScrollY,
                },
              },
            },
          ],
          {useNativeDriver: true},
        )}
        onEndReached={playerData.result.user && loadFeed}
        onEndReachedThreshold={playerData.result.user && 0}
        ListFooterComponent={
          isFetchingNextPage && playerData.result.user ? (
            <View style={{marginTop: 20}}>
              <ActivityIndicator size={'large'} />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
});

export default CommunityFlatList;
