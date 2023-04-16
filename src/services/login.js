import request from "@/utils/request";
import ApiUrl from "@/config/api-url";

export async function userLogin(params) {
  return request(`${ApiUrl.ManApiUrl}/auth/login`, {
    method: "POST",
    data: params,
  });
}
