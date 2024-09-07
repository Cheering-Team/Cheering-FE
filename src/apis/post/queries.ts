import {FilterType} from './types';

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (playerId: number, filter: FilterType) =>
    [...postKeys.lists(), {playerId, filter}] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (postId: number) => [...postKeys.details(), postId] as const,
};
