import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {meetKeys} from './queries';
import {createMeet, getAllMeetsByCommunity, getMeetById} from '.';

export const useGetMeetById = () => {
  return useQuery({queryKey: meetKeys.detail(1), queryFn: getMeetById});
};

export const useCreateMeet = () => {
  return useMutation({mutationFn: createMeet});
};

export const useGetAllMeetsByCommunity = (communityId: number) => {
  return useInfiniteQuery({
    queryKey: meetKeys.list(communityId),
    queryFn: getAllMeetsByCommunity,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    retry: false,
  });
};
