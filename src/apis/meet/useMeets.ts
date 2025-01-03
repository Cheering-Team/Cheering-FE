import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {meetKeys} from './queries';
import {createMeet, getAllMeetsByCommunity, getMeetById} from '.';
import {GetMeesPayload} from './types';

export const useGetMeetById = (meedId: number) => {
  return useQuery({queryKey: meetKeys.detail(meedId), queryFn: getMeetById});
};

export const useCreateMeet = () => {
  return useMutation({mutationFn: createMeet});
};

export const useGetAllMeetsByCommunity = (filter: GetMeesPayload) => {
  return useInfiniteQuery({
    queryKey: meetKeys.list(filter),
    queryFn: getAllMeetsByCommunity,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    retry: false,
  });
};
