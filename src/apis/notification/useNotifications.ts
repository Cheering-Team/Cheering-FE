import {useInfiniteQuery} from '@tanstack/react-query';
import {notificationKeys} from './queries';
import {getNotifications} from '.';

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
  });
};
