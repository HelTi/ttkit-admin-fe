import request, { type ApiResponse } from '@/utils/request';

/** 模版 */
export interface Template {
  _id: string;
  name: string;
  description?: string;
  content: string;
  is_active: boolean;
  create_time: string;
}

/** 预设（template_id 可为 populate 对象或 id） */
export interface Preset {
  _id: string;
  name: string;
  template_id: string | { _id: string; name?: string };
  description?: string;
  content: string;
  is_active: boolean;
  create_time: string;
}

/** 列表通用参数 */
export interface ListParams {
  page?: number;
  limit?: number;
  is_active?: boolean;
}

/** 列表响应 data 结构 */
export interface ListData<T> {
  data: T[];
  count: number;
}

/** 模版表单值 */
export interface TemplateFormValues {
  name: string;
  description?: string;
  content: string;
  is_active?: boolean;
}

/** 预设表单值 */
export interface PresetFormValues {
  name: string;
  template_id: string;
  description?: string;
  content: string;
  is_active?: boolean;
}

/** 获取模版列表 */
export async function fetchTemplateList(
  params: ListParams,
): Promise<ApiResponse<ListData<Template>>> {
  return request('/prompt-template', {
    method: 'GET',
    params,
  });
}

/** 创建模版 */
export async function createTemplate(
  data: TemplateFormValues,
): Promise<ApiResponse> {
  return request('/prompt-template', {
    method: 'POST',
    data,
  });
}

/** 更新模版 */
export async function updateTemplate(
  id: string,
  data: Partial<TemplateFormValues>,
): Promise<ApiResponse> {
  return request(`/prompt-template/${id}`, {
    method: 'PATCH',
    data,
  });
}

/** 删除模版 */
export async function deleteTemplate(id: string): Promise<ApiResponse> {
  return request(`/prompt-template/${id}`, {
    method: 'DELETE',
  });
}

/** 获取预设列表 */
export async function fetchPresetList(
  params: ListParams,
): Promise<ApiResponse<ListData<Preset>>> {
  return request('/prompt-preset', {
    method: 'GET',
    params,
  });
}

/** 创建预设 */
export async function createPreset(
  data: PresetFormValues,
): Promise<ApiResponse> {
  return request('/prompt-preset', {
    method: 'POST',
    data,
  });
}

/** 更新预设 */
export async function updatePreset(
  id: string,
  data: Partial<PresetFormValues>,
): Promise<ApiResponse> {
  return request(`/prompt-preset/${id}`, {
    method: 'PATCH',
    data,
  });
}

/** 删除预设 */
export async function deletePreset(id: string): Promise<ApiResponse> {
  return request(`/prompt-preset/${id}`, {
    method: 'DELETE',
  });
}
