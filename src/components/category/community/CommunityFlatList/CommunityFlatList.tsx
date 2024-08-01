import React, {Dispatch, forwardRef, SetStateAction} from 'react';
import CommunityProfile from '../CommunityProfile';
import CommunityTopTab from '../CommunityTopTab';
import FeedFilter from '../FeedFilter';
import {Animated, FlatList, ListRenderItem, View} from 'react-native';
import {Api} from '../../../../types/api';
import {GetPlayersInfoResponse} from '../../../../types/player';
import FeedPost from '../FeedPost';
import NotJoin from '../NotJoin';
import {PostInfoResponse} from '../../../../types/post';
import ListLoading from '../../../common/ListLoading/ListLoading';
import {useCommunityFlatList} from './useCommunityFlatList';
import ListEmpty from '../../../common/ListEmpty/ListEmpty';

interface CommunityFlatListProps {
  playerData: Api<GetPlayersInfoResponse>;
  handleScrollBeginDrag: () => void;
  handleScrollEndDrag: () => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  scrollY: Animated.Value;
}

const CommunityFlatList = forwardRef<FlatList<any>, CommunityFlatListProps>(
  (props, ref) => {
    const {
      playerData,
      handleScrollBeginDrag,
      handleScrollEndDrag,
      setIsModalOpen,
      scrollY,
    } = props;

    const {
      selectedFilter,
      setSelectedFilter,
      feedData,
      isLoading,
      isFetchingNextPage,
      loadFeed,
    } = useCommunityFlatList(playerData);

    const renderFeed: ListRenderItem<PostInfoResponse> = ({item}) => (
      <FeedPost
        feed={item}
        playerId={playerData.result.id}
        postId={item.id}
        selectedFilter={selectedFilter}
      />
    );
    return (
      <Animated.FlatList
        ref={ref}
        data={
          isLoading ? [] : feedData?.pages.flatMap(page => page.result.posts)
        }
        renderItem={renderFeed}
        contentContainerStyle={{paddingBottom: 30}}
        scrollEnabled={!!playerData.result.user || feedData?.pages.length === 0}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <CommunityProfile playerData={playerData} />
            <CommunityTopTab />
            {playerData.result.user && (
              <FeedFilter
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
              />
            )}
          </>
        }
        onEndReached={playerData.result.user && loadFeed}
        onEndReachedThreshold={playerData.result.user && 1}
        ListFooterComponent={
          isFetchingNextPage && playerData.result.user ? <ListLoading /> : null
        }
        ListEmptyComponent={
          !playerData.result.user ? (
            <NotJoin playerData={playerData} setIsModalOpen={setIsModalOpen} />
          ) : isLoading ? (
            <ListLoading />
          ) : (
            <ListEmpty />
          )
        }
        ItemSeparatorComponent={() => (
          <View
            style={{backgroundColor: '#F0F2F5', height: 6, width: '100%'}}
          />
        )}
        keyboardShouldPersistTaps="always"
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ],
          {useNativeDriver: false},
        )}
      />
    );
  },
);

export default CommunityFlatList;
