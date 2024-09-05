import {useIsFocused} from '@react-navigation/native';
import {useInfiniteQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {getPosts} from '../../../apis/post';
import {GetPlayersInfoResponse} from '../../../types/player';

export const useFeedList = (playerData: GetPlayersInfoResponse) => {
  const isFocused = useIsFocused();

  const [selectedFilter, setSelectedFilter] = useState('all');

  const {
    data: feedData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', playerData.id, selectedFilter],
    queryFn: getPosts,
    initialPageParam: 0,
    getNextPageParam: (lastpage, pages) => {
      if (lastpage.result.last) {
        return undefined;
      }
      return pages.length;
    },
    enabled: playerData.user !== null,
  });

  const loadFeed = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (isFocused && playerData.user) {
      refetch();
    }
  }, [isFocused, playerData.user, refetch]);

  return {
    selectedFilter,
    setSelectedFilter,
    feedData,
    isLoading,
    isFetchingNextPage,
    loadFeed,
  };
};
