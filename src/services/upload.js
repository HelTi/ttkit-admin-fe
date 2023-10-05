import request from "@/utils/request";

export async function uploadFile(formdata) {
  return request("/file/upload", {
    method: "POST",
    data: formdata,
    headers: {
      "Content-type": "multipart/form-data",
    },
  });
}

// 上传oss文件
export async function uploadOssFile(formdata) {
  return request("/oss/upload", {
    method: "POST",
    data: formdata,
    headers: {
      "Content-type": "multipart/form-data",
    },
  });
}
