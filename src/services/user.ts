import ApiUrl from '@/config/api-url';
import type {
  UserInfo,
  UpdatePasswordParams,
  UpdateUserInfoParams,
  UserListParams,
  UserListResponse,
} from '@/types/user';
import request, { ApiResponse } from '@/utils/request';

/**
 * 更新密码
 * @param params 更新密码参数
 * @returns 更新结果
 */
export async function userUpdatePassword(
  params: UpdatePasswordParams,
): Promise<ApiResponse<void>> {
  return request(`${ApiUrl.ManApiUrl}/user/update/password`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取当前用户信息
 * @param params 查询参数（可选）
 * @returns 当前用户信息
 */
export async function queryCurrentUserInfo(
  params?: Record<string, unknown>,
): Promise<ApiResponse<UserInfo>> {
  return request(`${ApiUrl.ManApiUrl}/user/info`, {
    method: 'GET',
    params,
  });
}

/**
 * 更新用户信息
 * @param params 更新用户信息参数
 * @returns 更新后的用户信息
 */
export async function queryUpdateUserInfo(
  params: UpdateUserInfoParams,
): Promise<ApiResponse<UserInfo>> {
  return request(`${ApiUrl.ManApiUrl}/user/update/info`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取用户列表
 * @param params 用户列表查询参数
 * @returns 用户列表数据
 */
export async function queryUserList(
  params: UserListParams,
): Promise<ApiResponse<UserListResponse>> {
  return request(`${ApiUrl.ManApiUrl}/user/list`, {
    method: 'GET',
    params: params,
  });
}

/**
 * 删除用户
 * @param id 用户 ID
 * @returns 删除结果
 */
export async function queryDelteUserById(
  id: string | number,
): Promise<ApiResponse<void>> {
  return request(`${ApiUrl.ManApiUrl}/user/delete`, {
    method: 'POST',
    data: {
      id,
    },
  });
}
