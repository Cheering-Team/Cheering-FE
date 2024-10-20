import {useState} from 'react';
import {useGetPosts} from '../../../apis/post/usePosts';
import {FilterType} from '../../../apis/post/types';
import {Community} from 'apis/player/types';

export const useFeedList = (playerData: Community) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const {
    data: feedData,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPosts(
    playerData.id,
    'FAN_POST',
    selectedFilter,
    playerData.user !== null,
  );

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
