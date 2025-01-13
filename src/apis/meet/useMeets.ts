import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {meetFanKeys, meetKeys} from './queries';
import {
  createMeet,
  findAllMyMeets,
  getAllMeetsByCommunity,
  getMeetById,
  getMeetMembers,
} from '.';
import {GetMeesPayload} from './types';

export const useGetMeetById = (meedId: number | null) => {
  return useQuery({
    queryKey: meetKeys.detail(meedId),
    queryFn: getMeetById,
    enabled: meedId !== null,
  });
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

export const useGetMeetMembers = (meetId: number) => {
  return useQuery({
    queryKey: meetFanKeys.list(meetId),
    queryFn: getMeetMembers,
  });
};

export const useFindAllMyMeets = (communityId: number) => {
  return useInfiniteQuery({
    queryKey: meetKeys.my(communityId),
    queryFn: findAllMyMeets,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    retry: false,
  });
};
