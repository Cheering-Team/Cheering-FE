import {GetMeesPayload} from './types';

export const meetKeys = {
  all: ['meets'] as const,
  lists: () => [...meetKeys.all, 'list'] as const,
  list: (filter: GetMeesPayload) => [...meetKeys.lists(), filter] as const,
  my: (communityId: number, pastFiltering: boolean) =>
    [...meetKeys.lists(), 'my', {communityId, pastFiltering}] as const,
  randomFive: (communityId: number) =>
    [...meetKeys.lists(), 'random', {communityId}] as const,
  details: () => [...meetKeys.all, 'detail'] as const,
  detail: (meetId: number | null) => [...meetKeys.details(), meetId] as const,
};

export const meetFanKeys = {
  all: ['meetFans'] as const,
  lists: () => [...meetFanKeys.all, 'list'] as const,
  list: (meetId: number) => [...meetFanKeys.lists(), {meetId}] as const,
};
