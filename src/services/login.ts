import request from "@/utils/request";
import ApiUrl from "@/config/api-url";

// 验证码响应接口
export interface CaptchaResponse {
  image?: string;
  captchaId?: string;
  [key: string]: any;
}

// 登录请求参数接口
export interface LoginParams {
  name: string;
  password: string;
  captcha: string;
  captchaId?: string;
}

// 登录响应接口
export interface LoginResponse {
  code?: number;
  data?: {
    token?: string;
    [key: string]: any;
  };
  message?: string;
  [key: string]: any;
}

export async function userLogin(params: LoginParams): Promise<LoginResponse> {
  return request<LoginResponse>(`${ApiUrl.ManApiUrl}/auth/login`, {
    method: "POST",
    data: params,
  });
}

/**
 * 获取图形验证码
 * @returns 验证码响应数据
 */
export async function fetchCaptcha(): Promise<CaptchaResponse> {
  return request<CaptchaResponse>(`${ApiUrl.ManApiUrl}/captcha`, {
    method: "GET",
  });
}

