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
  listByLeague: (leagueId: number | null) =>
    [...teamKeys.lists(), {leagueId}] as const,
  listByPlayer: (playerId: number | null) =>
    [...teamKeys.lists(), {playerId}] as const,
};
