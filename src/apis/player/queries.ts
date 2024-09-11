export const playerKeys = {
  all: ['players'] as const,
  lists: () => [...playerKeys.all, 'list'] as const,
  list: (filter: 'my') => [...playerKeys.lists(), {filter}] as const,
};
