import {useState} from 'react';
import {useGetPosts} from '../../../apis/post/usePosts';
import {FilterType} from '../../../apis/post/types';
import {Community} from 'apis/community/types';

export const useFeedList = (playerData: Community) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const {
    data: posts,
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
