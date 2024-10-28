import {axiosInstance} from 'apis';
import {ApiResponse} from 'apis/types';
import {communityKeys} from './queries';
import {Community, JoinCommunityPayload} from './types';

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

// 특정 팀 소속 커뮤니티 목록 조회
export const getCommunitiesByTeam = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof communityKeys.listByTeam>;
}) => {
  const [, , {teamId}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<Community[]>>(
    `/teams/${teamId}/communities`,
  );
  return response.data.result;
};

// 커뮤니티 검색
export const getCommunities = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof communityKeys.listBySearch>;
}) => {
  const [, , {name}] = queryKey;
  const response = await axiosInstance.get<ApiResponse<Community[]>>(
    `/communities?name=${name}`,
  );
  return response.data.result;
};

// 커뮤니티 가입
export const joinCommunity = async (data: JoinCommunityPayload) => {
  const {communityId, name, image} = data;
  const formData = new FormData();
  formData.append('name', name);
  if (image.uri) {
    formData.append('image', image);
  }
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
