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

// 删除oss文件
export async function deleteOssFile(fileNames = '', fileId = '') {
  return request("/oss/delete", {
    method: "POST",
    data: {
      fileNames: fileNames,
      id: fileId
    }
  });
}

// 删除文件
export async function deleteFile(fileId = '') {
  return request("/file/delete", {
    method: "POST",
    data: {
      id: fileId
    }
  });
}
