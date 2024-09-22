import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';
import {notificationKeys} from './queries';
import {getIsUnread, getNotifications, readNotification} from '.';

export const useGetNotifications = () => {
  return useInfiniteQuery({
    queryKey: notificationKeys.lists(),
    queryFn: getNotifications,
    initialPageParam: 0,
    getNextPageParam: (lastpage, pages) => {
      if (lastpage.result.last) {
        return undefined;
      }
      return pages.length;
    },
    enabled: false,
  });
};

export const useGetIsUnread = () => {
  return useQuery({
    queryKey: notificationKeys.isUnread(),
    queryFn: getIsUnread,
  });
};

export const useReadNotification = () => {
  return useMutation({mutationFn: readNotification});
};
