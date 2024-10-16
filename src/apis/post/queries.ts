import {FilterType} from './types';

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (playerId: number, filter: FilterType, playerUserId: number = 0) =>
    [...postKeys.lists(), {playerId, filter, playerUserId}] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (postId: number) => [...postKeys.details(), postId] as const,
};

export const dailyKeys = {
  all: ['dailys'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (playerId: number, date: string) =>
    [...dailyKeys.lists(), {playerId, date}] as const,
};
