import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {meetFanKeys, meetKeys} from './queries';
import {
  acceptJoinRequest,
  createMeet,
  deleteMeet,
  editMeet,
  findAllMyMeets,
  getAllMeetsByCommunity,
  getMeetById,
  getMeetMembers,
  leaveMeet,
  reportMember,
} from '.';
import {GetMeesPayload} from './types';
import {queryClient} from '../../../App';
import {chatKeys} from 'apis/chat/queries';

export const useGetMeetById = (meedId: number | null) => {
  return useQuery({
    queryKey: meetKeys.detail(meedId),
    queryFn: getMeetById,
    enabled: meedId !== null,
  });
};

export const useCreateMeet = () => {
  return useMutation({
    mutationFn: createMeet,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: meetKeys.lists()});
    },
  });
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

export const useFindAllMyMeets = (
  communityId: number,
  pastFiltering: boolean,
) => {
  return useInfiniteQuery({
    queryKey: meetKeys.my(communityId, pastFiltering),
    queryFn: findAllMyMeets,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    retry: false,
  });
};

export const useAcceptJoinRequest = (chatRoomId: number) => {
  return useMutation({
    mutationFn: acceptJoinRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: chatKeys.list(chatRoomId)});
    },
  });
};

export const useDeleteMeet = () => {
  return useMutation({
    mutationFn: deleteMeet,
  });
};

export const useLeaveMeet = () => {
  return useMutation({
    mutationFn: leaveMeet,
  });
};

export const useReportMember = () => {
  return useMutation({
    mutationFn: reportMember,
  });
};

export const useEditMeet = () => {
  return useMutation({
    mutationFn: editMeet,
    onSuccess: (_, variables) => {
      const {meetId} = variables;
      queryClient.invalidateQueries({queryKey: meetKeys.detail(meetId)});
    },
  });
};
