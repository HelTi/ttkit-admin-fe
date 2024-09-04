import { uploadFile, uploadOssFile } from '@/services/upload';
import { Button } from 'antd';
import React, { useRef } from 'react';

function UploadFileButton({ uploadFileType = 1, uploadSuccess = () => { } }) {
  const fileInputRef = useRef(null);
  // const [selectedFile, setSelectedFile] = useState(null);

  const handleButtonClick = () => {
    // 通过 ref 动态触发文件选择框
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if(!file) return
    handleUpload(file)
  };

  const handleUpload = (selectedFile) => {
    if (!selectedFile) {
      alert("请选择文件!");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    // 上传函数
    let uploadFun = () => { }
    if (uploadFileType === 2) {
      uploadFun = uploadOssFile
    } else {
      uploadFun = uploadFile
    }

    // 上传接口回调
    uploadFun(formData)
      .then((res) => {
        console.log("up", res);
        if (res.code === 200) {
          const filePath = res?.data?.filePath
          uploadSuccess(filePath)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      {/* 隐藏的文件输入框 */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* 自定义的上传按钮 */}
      <Button onClick={handleButtonClick}>上传文件</Button>
      {/* {selectedFile && <p>已选择文件: {selectedFile.name}</p>} */}
    </div>
  );
}

export default UploadFileButton;