import React from 'react';
import {Tabs} from 'react-native-collapsible-tab-view';
import FeedFilter from '../FeedFilter';
import {useCommunityFeedFlatList} from '../CommunityFeedFlatList/useCommunityFeedFlatList';
import {ListRenderItem} from 'react-native';
import {PostInfoResponse} from '../../../types/post';
import FeedPost from '../FeedPost';
import ListLoading from '../../common/ListLoading/ListLoading';
import ListEmpty from '../../common/ListEmpty/ListEmpty';

interface Props {
  playerData: any;
}

const FeedList = (props: Props) => {
  const {playerData} = props;

  const {
    selectedFilter,
    setSelectedFilter,
    feedData,
    isLoading,
    isFetchingNextPage,
    loadFeed,
  } = useCommunityFeedFlatList(playerData);

  const renderFeed: ListRenderItem<PostInfoResponse> = ({item}) => (
    <FeedPost
      feed={item}
      playerId={playerData.id}
      postId={item.id}
      selectedFilter={selectedFilter}
      type="community"
    />
  );

  return (
    <Tabs.FlatList
      data={isLoading ? [] : feedData?.pages.flatMap(page => page.result.posts)}
      renderItem={renderFeed}
      ListHeaderComponent={
        <FeedFilter
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
      }
      contentContainerStyle={{paddingBottom: 70}}
      scrollEnabled={!!playerData.user}
      onEndReached={playerData.user && loadFeed}
      onEndReachedThreshold={playerData.user && 1}
      ListFooterComponent={
        isFetchingNextPage && playerData.user ? <ListLoading /> : null
      }
      ListEmptyComponent={isLoading ? <ListLoading /> : <ListEmpty />}
    />
  );
};

export default FeedList;
