import {useState} from 'react';
import {useGetPosts} from '../../../apis/post/usePosts';
import {FilterType} from '../../../apis/post/types';
import {Player} from 'apis/player/types';

export const useFeedList = (community: Player) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const {
    data: posts,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPosts(
    community.id,
    'FAN_POST',
    selectedFilter,
    community.curFan !== null,
  );

  const loadPosts = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return {
    selectedFilter,
    setSelectedFilter,
    posts,
    isLoading,
    refetch,
    isFetchingNextPage,
    loadPosts,
  };
};
