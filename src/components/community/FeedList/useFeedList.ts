import {useState} from 'react';
import {GetPlayersInfoResponse} from '../../../types/player';
import {useGetPosts} from '../../../apis/post/usePosts';
import {FilterType} from '../../../apis/post/types';

export const useFeedList = (playerData: GetPlayersInfoResponse) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const {
    data: feedData,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPosts(playerData.id, selectedFilter, playerData.user !== null);

  const loadFeed = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return {
    selectedFilter,
    setSelectedFilter,
    feedData,
    isLoading,
    refetch,
    isFetchingNextPage,
    loadFeed,
  };
};
