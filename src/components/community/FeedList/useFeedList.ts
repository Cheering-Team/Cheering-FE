import {useState} from 'react';
import {useGetPosts} from '../../../apis/post/usePosts';
import {FilterType} from '../../../apis/post/types';
import {Community} from 'apis/community/types';

export const useFeedList = (community: Community) => {
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
    selectedFilter,
    community.curFan !== null || community.role === 'ADMIN',
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
