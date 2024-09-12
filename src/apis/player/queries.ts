// 선수
export const playerKeys = {
  all: ['players'] as const,
  lists: () => [...playerKeys.all, 'list'] as const,
  list: (filter: 'my') => [...playerKeys.lists(), {filter}] as const,
};

// 커뮤니티 유저
export const playerUserKeys = {
  all: ['playerusers'] as const,
  details: () => [...playerUserKeys.all, 'detail'] as const,
  detail: (playerUserId: number) =>
    [...playerUserKeys.details(), playerUserId] as const,
};
