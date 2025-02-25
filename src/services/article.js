import ApiUrl from "@/config/api-url";
import request from "@/utils/request";

export async function queryArticleList({ pageNo = 1, pageSize = 10 } = {}) {
  return request(`/article/pages`, {
    method: "GET",
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

/**
 * 获取推荐文章，banner 位
 */
export async function fetchRecommendArticles () {
  return request(`/article/recommend`, {
    method: 'GET',
    params: null,
  })
}

/**
 * 编辑推荐文章
 * @param {*} uuids 
 * @returns 
 */
export async function fetchAddRecommendArticel (uuids) {
  return request('/article/recommend', {
    method: 'POST',
    data: { uuids },
  })
}

/**
 * 删除推荐文章
 * @param {*} uuid 
 * @returns 
 */
export async function fetchDeleteRecommendArticel (uuid) {
  return request(`/article/recommend/${uuid}`, {
    method: 'DELETE',
  })
}

export async function fetchAiGenerateArticel (params={}) {
  return request(`${ApiUrl.AIServiceUrl}/workflows/article`, {
    method: 'POST',
    data: { 
      ...params
     },
  })
}