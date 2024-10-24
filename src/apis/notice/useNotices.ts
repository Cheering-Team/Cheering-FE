import {useMutation, useQuery} from '@tanstack/react-query';
import {noticeKeys} from './queries';
import {apply, getNoticeById, getNotices} from '.';

export const useGetNotices = () => {
  return useQuery({
    queryKey: noticeKeys.lists(),
    queryFn: getNotices,
    retry: false,
  });
};

export const useGetNoticeById = (noticeId: number) => {
  return useQuery({
    queryKey: noticeKeys.detail(noticeId),
    queryFn: getNoticeById,
    retry: false,
  });
};

export const useApply = () => {
  return useMutation({mutationFn: apply});
};
