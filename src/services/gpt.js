import request from '@/utils/request'

export async function queryGetChatWsUrl() {
  return request(`/gpt/wsUrl`, {
    method: "GET"
  })
}