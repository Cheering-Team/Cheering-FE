import {axiosInstance} from 'apis';
import {ApiResponse} from 'apis/types';
import {communityKeys} from './queries';
import {
  ChangeCommunityOrderPayload,
  Community,
  JoinCommunitiesPayload,
  JoinCommunityPayload,
  SearchPlayersResponse,
} from './types';

// 커뮤니티 조회
export const getCommunityById = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof communityKeys.detail>;
}) => {
  const [, , communityId] = queryKey;
  const response = await axiosInstance.get<ApiResponse<Community>>(
    `/communities/${communityId}`,
  );
  return response.data.result;
};

// 선수 검색
export const searchPlayers = async ({
  queryKey,
  pageParam,
}: {
  queryKey: ReturnType<typeof communityKeys.listBySearch>;
  pageParam: number;
}) => {
  const [, , {teamId, name}] = queryKey;
  let response;
  if (!teamId) {
    response = await axiosInstance.get<ApiResponse<SearchPlayersResponse>>(
      `/players?teamId=&name=${name}&page=${pageParam}&size=12`,
    );
  } else {
    response = await axiosInstance.get<ApiResponse<SearchPlayersResponse>>(
      `/players?teamId=${teamId}&name=${name}&page=${pageParam}&size=12`,
    );
  }
  return response.data.result;
};

// 커뮤니티 가입
export const joinCommunity = async (data: JoinCommunityPayload) => {
  const {communityId, name} = data;
  const formData = new FormData();
  formData.append('name', JSON.stringify(name));
  const response = await axiosInstance.post<ApiResponse<null>>(
    `/communities/${communityId}/fans`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data.result;
};

// 내가 가입한 커뮤니티 조회
export const getMyCommunities = async () => {
  const response =
    await axiosInstance.get<ApiResponse<Community[]>>('/my/communities');
  return response.data.result;
};

// 커뮤니티 순서 변경
export const changeCommunityOrder = async (
  data: ChangeCommunityOrderPayload[],
) => {
  const response = await axiosInstance.put<ApiResponse<null>>(
    '/communities/order',
    data,
  );
  return response.data.result;
};

// 커뮤니티 모두 가입 (신규 유저)
export const joinCommunities = async (data: JoinCommunitiesPayload) => {
  const response = await axiosInstance.post<ApiResponse<null>>('/fans', data);
  return response.data.result;
};

// 랜덤 커뮤니티 조회
export const getRandomCommunity = async () => {
  const response = await axiosInstance.get<ApiResponse<Community>>(
    '/communities/random',
  );
  return response.data.result;
};

// 인기 선수 조회
export const getPopularPlayers = async () => {
  const response =
    await axiosInstance.get<ApiResponse<Community[]>>(`/players/popular`);
  return response.data.result;
};
