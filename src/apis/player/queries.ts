// 리그
export const leagueKeys = {
  all: ['leagues'] as const,
  lists: () => [...leagueKeys.all, 'list'] as const,
  list: (sportId: number | null) => [...leagueKeys.lists(), {sportId}] as const,
};

// 팀
export const teamKeys = {
  all: ['teams'] as const,
  lists: () => [...teamKeys.all, 'list'] as const,
  list: (leagueId: number | null) => [...teamKeys.lists(), {leagueId}] as const,
};

// 선수
export const playerKeys = {
  all: ['players'] as const,
  lists: () => [...playerKeys.all, 'list'] as const,
  list: (filter: string) => [...playerKeys.lists(), {filter}] as const,
  listByTeam: (teamId: number) => [...playerKeys.lists(), {teamId}] as const,
  details: () => [...playerKeys.all, 'detail'] as const,
  detail: (playerId: number, refreshKey: number) =>
    [...playerKeys.details(), playerId, refreshKey] as const,
};

// 커뮤니티 유저
export const playerUserKeys = {
  all: ['playerusers'] as const,
  details: () => [...playerUserKeys.all, 'detail'] as const,
  detail: (playerUserId: number) =>
    [...playerUserKeys.details(), playerUserId] as const,
  blockList: (playerUserId: number) =>
    [...playerUserKeys.all, 'list', 'blocked', {playerUserId}] as const,
};
