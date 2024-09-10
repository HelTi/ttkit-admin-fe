import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';

const JsonReaderModal = ({buttonText="解析JSON", success = ()=>{}}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [parsedJson, setParsedJson] = useState(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setParsedJson(parsed);
      success(parsed)
      console.log(parsed); // 打印 JSON 对象
      setIsModalVisible(false);
    } catch (error) {
      console.error('Invalid JSON:', error);
      alert('请输入有效的 JSON 字符串');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        {buttonText}
      </Button>
      <Modal
        title="输入 JSON 字符串"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="解析 JSON"
        cancelText="取消"
      >
        <Input.TextArea
          value={jsonInput}
          onChange={handleJsonInputChange}
          placeholder="请输入 JSON 字符串"
          rows={8}
        />
        <div style={{maxHeight:100, overflow:"auto"}}>
          <h3>解析后的 JSON 内容:</h3>
          <pre>{parsedJson ? JSON.stringify(parsedJson, null, 2) : '无'}</pre>
        </div>
      </Modal>
    </div>
  );
};

export default JsonReaderModal;