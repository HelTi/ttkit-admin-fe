import request from '@/utils/request';

export async function queryTopCount() {
  return request('/data/topcount');
}

export async function queryDayViews() {
  return request('/data/dayviews');
}
