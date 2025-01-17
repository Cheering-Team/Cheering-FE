// 커뮤니티 유저
export const fanKeys = {
  all: ['fans'] as const,
  details: () => [...fanKeys.all, 'detail'] as const,
  detail: (fanId: number | undefined) => [...fanKeys.details(), fanId] as const,
  blockList: (fanId: number) =>
    [...fanKeys.all, 'list', 'blocked', {fanId}] as const,
};
