import {axiosInstance} from '.';

// SPORT

export const getSports = async () => {
  const response = await axiosInstance.get('/sports');
  return response.data;
};

// LEAGUE

export const getLeagues = async ({queryKey}) => {
  const [_key, sportId] = queryKey;
  const response = await axiosInstance.get(`/sports/${sportId}/leagues`);
  return response.data;
};

// TEAM

export const getTeams = async ({queryKey}) => {
  const [_key, leagueId] = queryKey;
  const response = await axiosInstance.get(`/leagues/${leagueId}/teams`);
  return response.data;
};
