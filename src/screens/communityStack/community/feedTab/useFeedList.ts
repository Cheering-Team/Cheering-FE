import {useState} from 'react';
import {Community} from 'apis/community/types';
import {useGetPosts} from 'apis/post/usePosts';
import {FilterType} from 'components/community/FeedFilter';

export const useFeedList = (community: Community) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const {
    data: posts,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPosts(community.id, selectedFilter, community.curFan !== null);

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
