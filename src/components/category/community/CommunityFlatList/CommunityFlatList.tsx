import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {Animated, Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCommunityFlatListHook} from './hooks/useCommunityFlatListHook';
import CommunityHeader from '../CommunityHeader';
import {useQuery} from '@tanstack/react-query';
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

  const {data: feedData, refetch} = useQuery({
    queryKey: ['posts', playerId, selectedFilter],
    queryFn: getPosts,
  });

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  nativeScrollY.addListener(
    Animated.event([{value: scrollY}], {useNativeDriver: false}),
  );

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
        data={playerData.result.user ? feedData?.result.posts : [1]}
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
      />
    </SafeAreaView>
  );
});

export default CommunityFlatList;
