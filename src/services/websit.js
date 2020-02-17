import request from '@/utils/request';

/**
 * 获取文件上传列表
 * @param {*} param0
 */
export async function fetchUploadList({ page = 1, pageSize = 10 } = {}) {
  return request('/upload/list', {
    method: 'GET',
    params: {
      page,
      pageSize,
    },
  });
}

/**
 * 获取访客列表
 * @param {*} param0
 */
export async function fetchVisitorList({ page = 1, pageSize = 10 } = {}) {
  return request('/visitor', {
    method: 'GET',
    params: {
      page,
      pageSize,
    },
  });
}
