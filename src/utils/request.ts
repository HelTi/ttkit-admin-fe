import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { message } from "antd";
import { history } from "@umijs/max";
import ApiUrl from "@/config/api-url";
import storage from "./storage";

// 响应数据接口
export interface ApiResponse<T = any> {
  code?: number;
  data?: T;
  message?: string;
  [key: string]: any;
}

// 自定义请求配置接口
interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean; // 跳过错误处理
}

/**
 * 获取 token
 * @returns token 字符串或 null
 */
function getToken(): string | null {
  return storage.get("token");
}

const axiosInstance: AxiosInstance = axios.create({
  timeout: 120000,
  baseURL: ApiUrl.ManApiUrl,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  withCredentials: true,
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前添加 token
    const token = getToken();
    if (token && config.headers) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 2xx 范围内的状态码都会触发该函数
    // 直接返回 response.data，由业务代码处理具体的数据结构
    return response.data as any;
  },
  (error: AxiosError<ApiResponse>) => {
    // 超出 2xx 范围的状态码都会触发该函数
    console.error("Response error:", error);

    const { response, config } = error;

    // 如果配置了跳过错误处理，直接返回错误
    if ((config as RequestConfig)?.skipErrorHandler) {
      return Promise.reject(error);
    }

    // 401 未授权，跳转到登录页
    if (response?.status === 401) {
      message.error("用户无权限！");
      history.push("/login");
      return Promise.reject(error);
    }

    // 显示错误信息
    const errorMessage = response?.data?.message || error.message || "请求失败，请稍后重试";
    message.error(errorMessage);

    return Promise.reject(error);
  }
);

/**
 * 封装的请求函数，返回正确的泛型类型
 * @param url 请求地址
 * @param config 请求配置
 * @returns Promise<T> 返回泛型类型的数据
 */
function request<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return axiosInstance.request<ApiResponse<T>>({
    url,
    ...config,
  }) as unknown as Promise<ApiResponse<T>>;
}

export { getToken };
export default request;
