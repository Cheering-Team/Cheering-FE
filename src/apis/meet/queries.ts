import {GetMeesPayload} from './types';

export const meetKeys = {
  all: ['meets'] as const,
  lists: () => [...meetKeys.all, 'list'] as const,
  list: (filter: GetMeesPayload) => [...meetKeys.lists(), filter] as const,
  details: () => [...meetKeys.all, 'detail'] as const,
  detail: (meetId: number | null) => [...meetKeys.details(), meetId] as const,
};
