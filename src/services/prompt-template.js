import request from '@/utils/request';

// 获取模版列表
export async function fetchTemplateList(params) {
  return request('/prompt-template', {
    method: 'GET',
    params,
  });
}

// 创建模版
export async function createTemplate(data) {
  return request('/prompt-template', {
    method: 'POST',
    data,
  });
}

// 更新模版
export async function updateTemplate(id, data) {
  return request(`/prompt-template/${id}`, {
    method: 'PATCH',
    data,
  });
}

// 删除模版
export async function deleteTemplate(id) {
  return request(`/prompt-template/${id}`, {
    method: 'DELETE',
  });
}

// 获取预设列表
export async function fetchPresetList(params) {
  return request('/prompt-preset', {
    method: 'GET',
    params,
  });
}

// 创建预设
export async function createPreset(data) {
  return request('/prompt-preset', {
    method: 'POST',
    data,
  });
}

// 更新预设
export async function updatePreset(id, data) {
  return request(`/prompt-preset/${id}`, {
    method: 'PATCH',
    data,
  });
}

// 删除预设
export async function deletePreset(id) {
  return request(`/prompt-preset/${id}`, {
    method: 'DELETE',
  });
} 