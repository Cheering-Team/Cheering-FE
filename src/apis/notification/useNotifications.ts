import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {notificationKeys} from './queries';
import {getIsUnread, getNotifications, readNotification} from '.';

export const useGetNotifications = () => {
  return useInfiniteQuery({
    queryKey: notificationKeys.lists(),
    queryFn: getNotifications,
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      return lastPage.hasNext ? lastPage.pageNumber + 1 : undefined;
    },
    enabled: false,
    retry: false,
  });
};

export const useGetIsUnread = () => {
  return useQuery({
    queryKey: notificationKeys.isUnread(),
    queryFn: getIsUnread,
    retry: false,
  });
};

export const useReadNotification = () => {
  return useMutation({mutationFn: readNotification});
};
