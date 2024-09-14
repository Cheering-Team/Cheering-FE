export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  isUnread: () => [...notificationKeys.all, 'isUnread'] as const,
};
