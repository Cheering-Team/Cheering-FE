export const userKeys = {
  all: ['users'] as const,
  detail: () => [...userKeys.all, 'detail'] as const,
  playerAccount: (playerId: number) =>
    [...userKeys.all, 'playerAccount', playerId] as const,
  isAgeGenderSet: () => [...userKeys.all, 'isAgeGenderSet'] as const,
};
