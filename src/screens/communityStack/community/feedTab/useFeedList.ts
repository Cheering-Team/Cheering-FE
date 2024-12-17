import {useState} from 'react';
import {Community} from 'apis/community/types';
import {FilterType} from 'react-native-video';
import {useGetPosts} from 'apis/post/usePosts';

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
