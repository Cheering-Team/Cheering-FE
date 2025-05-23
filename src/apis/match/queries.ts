export const matchKeys = {
  all: ['matches'] as const,
  lists: () => [...matchKeys.all, 'list'] as const,
  list: (communityId: number, year: number, month: number) =>
    [...matchKeys.lists(), {communityId, year, month}] as const,
  nextList: (communityId: number) =>
    [...matchKeys.lists(), 'next', {communityId}] as const,
  twoWeeksList: (communityId: number) =>
    [...matchKeys.lists(), 'twoweeks', {communityId}] as const,
  nearList: (communityId: number) =>
    [...matchKeys.lists(), 'near', {communityId}] as const,
  listByDate: (year: number, month: number, day: number) =>
    [...matchKeys.lists(), {year, month, day}] as const,
  unfinishedList: () => [...matchKeys.lists(), 'unfinished'] as const,
  details: () => [...matchKeys.all, 'detail'] as const,
  detail: (matchId: number | null) =>
    [...matchKeys.details(), matchId] as const,
};
