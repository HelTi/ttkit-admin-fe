import request from "@/utils/request";
import ApiUrl from "@/config/api-url";

/**
 * 更新密码
 * @param {*} params 
 * @returns 
 */
export async function userUpdatePassword(params) {
  return request(`${ApiUrl.ManApiUrl}/user/update/password`, {
    method: "POST",
    data: params,
  });
}

/**
 * 获取当前用户信息
 * @param {*} params 
 * @returns 
 */
export async function queryCurrentUserInfo(params) {
  return request(`${ApiUrl.ManApiUrl}/user/info`, {
    method: "GET",
    data: params,
  });
}


/**
 * 更新密码
 * @param {*} params 
 * @returns 
 */
 export async function queryUpdateUserInfo(params) {
  return request(`${ApiUrl.ManApiUrl}/user/update/info`, {
    method: "POST",
    data: params,
  });
}

/**
 * 获取用户列表
 * @param {*} params 
 * @returns 
 */
export async function queryUserList(params) {
  return request(`${ApiUrl.ManApiUrl}/user/list`, {
    method: "GET",
    params: params,
  });
}

/**
 * 删除用户
 * @param {*} id 
 * @returns 
 */
export async function queryDelteUserById(id) {
  return request(`${ApiUrl.ManApiUrl}/user/delete`, {
    method: "POST",
    data: {
      id
    },
  });
}