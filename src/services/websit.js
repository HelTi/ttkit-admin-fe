import request from '@/utils/request';

/**
 * 获取文件上传列表
 * @param {*} param0
 */
export async function fetchUploadList({ pageNo = 1, pageSize = 10 } = {}) {
  return request('/file/list', {
    method: 'GET',
    params: {
      pageNo,
      pageSize,
    },
  });
}

/**
 * 获取访客列表
 * @param {*} param0
 */
export async function fetchVisitorList({ pageNo = 1, pageSize = 10 } = {}) {
  return request('/visitor', {
    method: 'GET',
    params: {
      pageNo,
      pageSize,
    },
  });
}

/**
 * 获取评论列表
 * @param {*} param0
 */
export async function fetchCommentList({ pageNo = 1, pageSize = 10 } = {}) {
  return request('/comment', {
    method: 'GET',
    params: {
      pageNo,
      pageSize,
    },
  });
}

/**
 * 删除评论
 * @param {*} _id
 */
export async function deleteCommentById(_id) {
  return request('/comment/delete', {
    method: 'GET',
    params: {
      _id,
    },
  });
}


export async function fetchApiCallHistoryList(params = {}) {
  return request('/stats/history', {
    method: 'GET',
    params: params,
  });
}


export async function fetchApiCallHistoryTopList() {
  return request('/stats/top-endpoints', {
    method: 'GET',
    params: {},
  });
}
