import {FilterType} from 'components/community/FeedFilter';

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (communityId: number, filter: FilterType) =>
    [...postKeys.lists(), {communityId, filter}] as const,
  listByFan: (fanId: number) => [...postKeys.lists(), {fanId}] as const,
  listMyHot: () => [...postKeys.lists(), 'my', 'hot'] as const,
  listByMatch: (matchId: number, communityId: number, orderBy: string) =>
    [...postKeys.lists(), {matchId, communityId, orderBy}] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (postId: number) => [...postKeys.details(), postId] as const,
};

export const dailyKeys = {
  all: ['dailys'] as const,
  lists: () => [...dailyKeys.all, 'list'] as const,
  list: (communityId: number, date: string) =>
    [...dailyKeys.lists(), {communityId, date}] as const,
  exist: (communityId: number) =>
    [...dailyKeys.all, 'exist', {communityId}] as const,
};
