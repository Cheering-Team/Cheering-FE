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
  details: () => [...teamKeys.all, 'detail'] as const,
  detail: (teamId: number) => [...teamKeys.details(), teamId] as const,
};

// 선수
export const communityKeys = {
  all: ['communities'] as const,
  lists: () => [...communityKeys.all, 'list'] as const,
  list: (filter: string) => [...communityKeys.lists(), {filter}] as const,
  listByTeam: (teamId: number) => [...communityKeys.lists(), {teamId}] as const,
  details: () => [...communityKeys.all, 'detail'] as const,
  detail: (communityId: number, refreshKey: number) =>
    [...communityKeys.details(), communityId, refreshKey] as const,
};

// 커뮤니티 유저
export const fanKeys = {
  all: ['fans'] as const,
  details: () => [...fanKeys.all, 'detail'] as const,
  detail: (fanId: number) => [...fanKeys.details(), fanId] as const,
  blockList: (fanId: number) =>
    [...fanKeys.all, 'list', 'blocked', {fanId}] as const,
};
