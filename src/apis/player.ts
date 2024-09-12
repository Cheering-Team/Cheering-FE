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

// PLAYERUSER

export const getPlayerUserInfo = async ({queryKey}) => {
  const [_key, playerUserId] = queryKey;
  const response = await axiosInstance.get(`/playerusers/${playerUserId}`);

  return response.data;
};

export const getPlayerUserPosts = async ({pageParam, queryKey}) => {
  const [_key, playerUserId] = queryKey;

  const response = await axiosInstance.get(
    `/playerusers/${playerUserId}/posts?page=${pageParam}&size=5`,
  );

  return response.data;
};

export const updatePlayerUserImage = async data => {
  const {playerUserId, image} = data;

  const formData = new FormData();

  formData.append('dummy', 'dummy');

  if (image) {
    formData.append('image', image);
  }

  const response = await axiosInstance.put(
    `/playerusers/${playerUserId}/image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};

export const updatePlayerUserNickname = async data => {
  const {playerUserId, nickname} = data;

  const response = await axiosInstance.put(
    `/playerusers/${playerUserId}/nickname`,
    {nickname},
  );

  return response.data;
};

export const deletePlayerUser = async data => {
  const {playerUserId} = data;
  const response = await axiosInstance.delete(`/playerusers/${playerUserId}`);

  return response.data;
};
