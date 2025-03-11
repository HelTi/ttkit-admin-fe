import request from "@/utils/request";

// 获取平台配置列表
export async function fetchPlatformList(params) {
  return request('/openai-platform', {
    method: 'GET',
    params
  });
}

// 创建平台配置
export async function createPlatform(data) {
  return request('/openai-platform', {
    method: 'POST',
    data
  });
}

// 更新平台配置
export async function updatePlatform(id, data) {
  return request(`/openai-platform/${id}`, {
    method: 'PATCH',
    data
  });
}

// 删除平台配置
export async function deletePlatform(id) {
  return request(`/openai-platform/${id}`, {
    method: 'DELETE'
  });
}

// 获取单个平台配置
export async function getPlatformById(id) {
  return request(`/openai-platform/${id}`, {
    method: 'GET'
  });
} 