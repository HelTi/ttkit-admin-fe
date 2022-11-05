import request from '@/utils/request';

export async function userLogin(params) {
  return request('/auth/login', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function userLoginOut() {
  return request('/loginout', {
    method: 'GET',
  });
}
