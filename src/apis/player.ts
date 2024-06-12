import {axiosInstance} from '.';

export const getPlayersByTeam = async ({queryKey}) => {
  const [_key, teamId] = queryKey;
  const response = await axiosInstance.get(`/teams/${teamId}/players`);
  return response.data;
};

export const getPlayersInfo = async ({queryKey}) => {
  const [_key, playerId] = queryKey;
  const response = await axiosInstance.get(`/players/${playerId}`);
  return response.data;
};
