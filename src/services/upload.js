import request from '@/utils/request';

export async function uploadFile (formdata) {
  return request('/upload', {
    method: 'POST',
    data: {
      formdata,
    },
  })
}
