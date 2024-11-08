import {axiosInstance} from 'apis';
import {ApiResponse} from 'apis/types';
import {communityKeys} from './queries';
import {
  ChangeCommunityOrderPayload,
  Community,
  CommunityListResponse,
  JoinCommunityPayload,
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

// 커뮤니티 검색
export const getCommunities = async ({
  queryKey,
}: {
  queryKey: ReturnType<typeof communityKeys.listBySearch>;
}) => {
  const [, , {teamId, name}] = queryKey;
  let response;
  if (!teamId) {
    response = await axiosInstance.get<ApiResponse<CommunityListResponse[]>>(
      `/communities?teamId=&name=${name}`,
    );
  } else {
    response = await axiosInstance.get<ApiResponse<CommunityListResponse[]>>(
      `/communities?teamId=${teamId}&name=${name}`,
    );
  }
  return response.data.result;
};

// 커뮤니티 가입
export const joinCommunity = async (data: JoinCommunityPayload) => {
  const {communityId, name} = data;
  const formData = new FormData();
  formData.append('name', name);
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
