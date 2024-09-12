import {axiosInstance} from '.';

export interface Image {
  uri: string;
  name: string | undefined;
  type: string;
}

interface postComminityJoinRequest {
  playerId: number;
  nickname: string;
  image: Image;
}

export const getPlayers = async ({name}) => {
  const response = await axiosInstance.get(`/players?name=${name}`);
  return response.data;
};

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

export const getCheckNickname = async ({playerId, nickname}) => {
  const response = await axiosInstance.get(`/players/${playerId}/nickname`, {
    params: {nickname},
  });

  return response.data;
};

export const postCommunityJoin = async (data: postComminityJoinRequest) => {
  const {playerId, nickname, image} = data;

  const formData = new FormData();

  formData.append('nickname', nickname);
  if (image.uri) {
    formData.append('image', image);
  }

  const response = await axiosInstance.post(
    `/players/${playerId}/users`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};
