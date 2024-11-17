export const applyKeys = {
  all: ['applies'] as const,
  list: () => [...applyKeys.all, 'list'] as const,
};
