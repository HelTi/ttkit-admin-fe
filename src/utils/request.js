import axios from "axios";
import { message } from "antd";
import ApiUrl from "@/config/api-url";
import storage from "./storage";

const axiosInstance = axios.create({
  timeout: 2000,
  baseURL: ApiUrl.ManApiUrl,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  withCredentials:true
});

axiosInstance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    config.headers["Authorization"] = getToken();
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    console.log('request error',error)
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.log('response error',error)
    const {response} = error
    if(response.status===401){
      message.error('用户无权限！')
      window.location.href = '/login'
    }
    message.error(response?.data?.message)
    return Promise.reject(response);
  }
);

export function getToken() {
  return storage.get("token");
}

export default axiosInstance;
