import {useMutation, useQuery} from '@tanstack/react-query';
import {meetKeys} from './queries';
import {createMeet, getMeetById} from '.';

export const useGetMeetById = () => {
  return useQuery({queryKey: meetKeys.detail(1), queryFn: getMeetById});
};

export const useCreateMeet = () => {
  return useMutation({mutationFn: createMeet});
};
