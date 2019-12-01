import request from '@/utils/request';

export async function queryArticleList({ page = 1, pageSize = 10 } = {}) {
  return request('/article/pages', {
    method: 'GET',
    params: {
      page,
      pageSize,
    },
  });
}

export async function fetchTags () {
  return request('/tag', {
    method: 'GET',
  })
}
