import request from '@/utils/request';

// 统计数据接口
export interface TopCount {
  comment: number;
  article: number;
  file: number;
  visitor: number;
}

// 日访问量数据接口
export interface DayViews {
  date: string;
  views: number;
  [key: string]: any;
}

// 日访问量响应接口
export interface DayViewsResponse {
  code?: number;
  data?: DayViews[];
  message?: string;
  [key: string]: any;
}

/**
 * 获取统计数据
 * @returns 统计数据响应
 */
export async function queryTopCount(){
  return request<TopCount>('/data/topcount', {
    method: 'GET',
  });
}

/**
 * 获取日访问量数据
 * @returns 日访问量响应
 */
export async function queryDayViews(){
  return request<DayViewsResponse>('/data/dayviews', {
    method: 'GET',
  });
}
