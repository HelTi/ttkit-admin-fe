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
