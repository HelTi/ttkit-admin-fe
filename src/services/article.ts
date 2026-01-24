import ApiUrl from "@/config/api-url";
import request, { ApiResponse } from "@/utils/request";

// Tag 类型定义
export interface Tag {
  _id: string;
  articleCount: number; // 文章数量
  create_time: string; // 创建时间
  name: string;
  [key: string]: any;
}

// 后端 TagItem 映射
export interface TagItem {
  _id?: string;
  name: string;
}

// Article 类型定义（与后端 Article 实体对应的最常用字段）
export interface Article {
  uuid: string;
  author: string;
  img_url: string;
  tags: TagItem[];
  meta: {
    views: number;
  };
  create_time: string;
  update_time: string;
  title: string;
  [key: string]: any;
}

// 分页基础参数（对应 Nest 的 PagenationParams）
export interface PaginationParams {
  pageSize: number;
  pageNo: number;
  queryParams?: Record<string, any>;
  sortParams?: Record<string, any>;
  field?: string;
  private?: 0 | 1;
}

// 查询文章列表参数（对应 Nest 的 QueryArticleParams）
export interface QueryArticleParams extends PaginationParams {
  title?: string;
  tag?: string;
  views?: number;
  viewsMin?: number;
  viewsMax?: number;
  updateTimeStart?: string | Date;
  updateTimeEnd?: string | Date;
}

// 分页响应类型
export interface ArticleListResponse {
  data: Article[];
  count: number;
  [key: string]: any;
}

type ArticleType = 1|2; // 文章类型 1: 原创 2: 转载

// 新增文章参数（对应 Nest 的 CreateArticelDto）
export interface CreateArticleDto {
  title: string;  // 文章标题
  img_url?: string;  // 文章封面
  private: 0 | 1;  // 0: 公开 1: 私有
  type: ArticleType;  // 文章类型
  markdown: string;  // 文章markdown内容
  content: string;  // 文章html内容
  excerpt: string;  // 文章摘要
  author: string;  // 文章作者
  tags?: TagItem[];  // 文章标签
  toc?: string[];  // 文章目录
}

// 更新文章参数（对应 Nest 的 UpdateArticleDto = Partial<CreateArticelDto>）
export type UpdateArticleDto = Partial<CreateArticleDto>;

export async function queryArticleList(
  params: QueryArticleParams
): Promise<ApiResponse<ArticleListResponse>> {
  return request<ArticleListResponse>(`/article/pages`, {
    method: "GET",
    params,
  });
}

export async function fetchTags(): Promise<ApiResponse<Tag[]>> {
  return request<Tag[]>('/tag', {
    method: 'GET',
  });
}

export async function addTag(name: string): Promise<ApiResponse> {
  return request('/tag/add', {
    method: 'POST',
    data: {
      name,
    },
  });
}

export async function deleteTag(id: string): Promise<ApiResponse> {
  return request('/tag/delete', {
    method: 'POST',
    data: {
      _id: id,
    },
  });
}


export async function addArticle(
  params: CreateArticleDto
): Promise<ApiResponse<Article>> {
  return request<Article>('/article/add', {
    method: 'POST',
    data: params,
  });
}

export async function updateArticle(
  uuid: string,
  params: UpdateArticleDto
): Promise<ApiResponse<Article>> {
  return request<Article>('/article/update', {
    method: 'POST',
    data: { ...params, uuid },
  });
}

export async function deleteArticle(uid: string) {
  return request('/article/delete', {
    method: 'GET',
    params: { uid },
  });
}

export async function fetchArticleDetail(
  uuid: string
): Promise<ApiResponse<Article>> {
  return request<Article>(`/article/detail/${uuid}`, {
    method: 'GET',
    params: null,
  });
}

/**
 * 获取推荐文章，banner 位
 */
export async function fetchRecommendArticles(): Promise<ApiResponse<Article[]>> {
  return request<Article[]>(`/article/recommend`, {
    method: 'GET',
    params: null,
  });
}

/**
 * 编辑推荐文章
 * @param {*} uuids 
 * @returns 
 */
export async function fetchAddRecommendArticel(uuids: string[]): Promise<ApiResponse> {
  return request('/article/recommend', {
    method: 'POST',
    data: { uuids },
  });
}

/**
 * 删除推荐文章
 * @param {*} uuid 
 * @returns 
 */
export async function fetchDeleteRecommendArticel(uuid: string): Promise<ApiResponse> {
  return request(`/article/recommend/${uuid}`, {
    method: 'DELETE',
  });
}

export async function fetchAiGenerateArticel(params: any = {}) {
  return request(`${ApiUrl.AIServiceUrl}/workflows/article`, {
    method: 'POST',
    data: { 
      ...params
     },
  });
}