export const noticeKeys = {
  all: ['notices'] as const,
  lists: () => [...noticeKeys.all, 'list'] as const,
  details: () => [...noticeKeys.all, 'detail'] as const,
  detail: (noticeId: number) => [...noticeKeys.details(), noticeId] as const,
};
