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

export const getCheckNickname = async ({queryKey}) => {
  const [_key, playerId, nickname] = queryKey;
  const response = await axiosInstance.get(`/players/${playerId}/nickname`, {
    params: {nickname},
  });
  return response.data;
};
