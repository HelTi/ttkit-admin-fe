import request, { ApiResponse } from '@/utils/request';

// 上传文件响应接口
export interface UploadFileResponse {
  name: string;
  filePath: string;
  upload_date: string;
  file_type: string;
  size: number;
  type: number;
}

/**
 * 上传文件
 * @param formdata 表单数据
 * @returns 上传文件响应
 */
export async function uploadFile(formdata: FormData): Promise<ApiResponse<UploadFileResponse>> {
  return request('/file/upload', {
    method: 'POST',
    data: formdata,
    headers: {
      'Content-type': 'multipart/form-data',
    },
  });
}

/**
 * 上传oss文件
 * @param formdata
 * @returns
 */
export async function uploadOssFile(formdata: FormData): Promise<ApiResponse<UploadFileResponse>> {
  return request<UploadFileResponse>('/oss/upload', {
    method: 'POST',
    data: formdata,
    headers: {
      'Content-type': 'multipart/form-data',
    },
  });
}

// 删除oss文件
export async function deleteOssFile(fileNames = '', fileId = '') {
  return request('/oss/delete', {
    method: 'POST',
    data: {
      fileNames: fileNames,
      id: fileId,
    },
  });
}

// 删除文件
export async function deleteFile(fileId = '') {
  return request('/file/delete', {
    method: 'POST',
    data: {
      id: fileId,
    },
  });
}
