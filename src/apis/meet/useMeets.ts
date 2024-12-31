import {useQuery} from '@tanstack/react-query';
import {meetKeys} from './queries';
import {getMeetById} from '.';

export const useGetMeetById = () => {
  return useQuery({queryKey: meetKeys.detail(1), queryFn: getMeetById});
};
