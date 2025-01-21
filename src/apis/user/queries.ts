export const userKeys = {
  all: ['users'] as const,
  detail: () => [...userKeys.all, 'detail'] as const,
  playerAccount: (playerId: number) =>
    [...userKeys.all, 'playerAccount', playerId] as const,
  isAgeGenderSet: (communityId: number) =>
    [...userKeys.all, 'isAgeGenderSet', communityId] as const,
  ageGender: () => [...userKeys.all, 'ageGender'] as const,
};
