import request from '@/utils/request';

export async function queryArticleList({ pageNo = 1, pageSize = 10 } = {}) {
  return request('/article/pages', {
    method: 'GET',
    params: {
      pageNo,
      pageSize,
    },
  });
}

export async function fetchTags () {
  return request('/tag', {
    method: 'GET',
  })
}

export async function addTag (name) {
  return request('/tag/add', {
    method: 'POST',
    data: {
      name,
    },
  })
}

export async function deleteTag (id) {
  return request('/tag/delete', {
    method: 'POST',
    data: {
      _id: id,
    },
  })
}


export async function addArticle (params) {
  return request('/article/add', {
    method: 'POST',
    data: params,
  })
}

export async function updateArticle (uuid, params) {
  return request('/article/update', {
    method: 'POST',
    data: { ...params, uuid },
  })
}

export async function deleteArticle (uid) {
  return request('/article/delete', {
    method: 'GET',
    params: { uid },
  })
}

export async function fetchArticleDetail (uuid) {
  return request(`/article/detail/${uuid}`, {
    method: 'GET',
    params: null,
  })
}
