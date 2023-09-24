import request from "@/utils/request";
import ApiUrl from "@/config/api-url";

export async function userLogin(params) {
  return request(`${ApiUrl.ManApiUrl}/auth/login`, {
    method: "POST",
    data: params,
  });
}

/**
 * 获取图形验证码
 * @param {*} params 
 * @returns 
 */
export async function fetchCaptcha(params) {
  return request(`${ApiUrl.ManApiUrl}/captcha`, {
    method: "GET",
    data: params,
  });
}

