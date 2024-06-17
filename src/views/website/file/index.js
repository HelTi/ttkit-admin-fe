import ApiUrl from "@/config/api-url";
import { deleteFile, deleteOssFile } from "@/services/upload";
import { fetchUploadList } from "@/services/websit";
import { getToken } from "@/utils/request";
import { formatDate } from "@/utils/utils";
import { UploadOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { Form } from "antd";
import { Button, Card, message, Table, Upload, Modal } from "antd";
import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

const { confirm } = Modal

export default function FileAdmin() {
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [uploadFileType, setUploadFileType] = useState(2)
  const [paginationConfig, setPaginationConfig] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => (
      <>
        <p>共{total}条数据</p>
      </>
    ),
  });

  const fileUploadTypeOptions = [
    { value: 2, label: 'oss上传' },
    { value: 1, label: '本地上传' },
  ]

  const byte2kb = (val) => (val / 1024).toFixed(2);
  // 设置文件地址
  const setFileUlr = (record) => {
    // oss地址
    if (record?.type === 2) {
      return record.filePath
    } else {
      // 本地上传地址
      return `${ApiUrl.ManApiUrl}${record.filePath.replace("public", "")}`
    }
  }

  const columns = [
    {
      title: "文件名",
      dataIndex: "name",
    },
    {
      title: "预览",
      with: 100,
      render: (text, record) => (
        <div>
          <img
            alt=""
            style={{ width: 50 }}
            src={setFileUlr(record)}
          />
        </div>
      ),
    },
    {
      title: "文件路径",
      with: 500,
      ellipsis: true,
      render: (text, record) => (
        <CopyToClipboard
          text={setFileUlr(record)}
          onCopy={() => message.success("复制文本成功！")}
        >
          <span style={{ cursor: "pointer" }}>{setFileUlr(record)}</span>
        </CopyToClipboard>
      ),
    },
    {
      title: "文件大小",
      dataIndex: "size",
      render: (text) => `${byte2kb(text)}kb`,
    },
    {
      title: "上传时间",
      dataIndex: "upload_date",
      render: (text) => <span>{formatDate(text)}</span>,
    },
    {
      title: '操作',
      key: 'operation',
      width: 150,
      render: (text, record) => <div>
        <Button onClick={() => handleDeleteFile(record.name, record.type, record._id)}>删除</Button>
      </div>,
    },
  ];

  useEffect(() => {
    getTableHandle(paginationConfig);
  }, [paginationConfig]);

  const getTableHandle = async (p) => {
    setTableLoading(true);
    const params = {
      pageNo: p.current,
      pageSize: p.pageSize,
    };
    const res = await fetchUploadList(params);
    setTableLoading(false);
    const { data } = res;
    if (Array.isArray(data.data)) {
      setTableData(data.data);
      setTotal(data?.count || 0);
    }
  };

  const handleTableChange = (pagination) => {
    setPaginationConfig({
      ...paginationConfig,
      ...pagination,
    });
  };

  const UploadProps = {
    name: 'file',
    maxCount: 1,
    action: uploadFileType === 1 ? `${ApiUrl.ManApiUrl}/file/upload` : `${ApiUrl.ManApiUrl}/oss/upload`,
    headers: {
      Authorization: getToken(),
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success('上传文件成功！');
        getTableHandle(paginationConfig)
      } else if (info.file.status === 'error') {
        message.error('上传文件失败');
      }
    },
  };

  // 切换文件上传类型
  const handleSelectChange = (value) => {
    setUploadFileType(value)
  };

  const handleDeleteFile = async (fileName, type, fileId) => {
    console.log('fileName', fileName)
    confirm({
      title: "警告！",
      content: "确定要删除此文章吗？",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      async onOk() {
        let res = null
        if (type === 2) {
          res = await deleteOssFile(fileName, fileId)
        } else {
          res = await deleteFile(fileId)
        }
        if (res.code === 200) {
          message.success("删除文件成功！");
          getTableHandle(paginationConfig)
        } else {
          message.error("删除失败");
        }
      },
      onCancel() { },
    });
  }

  return (
    <Card>
      <div style={{ marginBottom: '6px' }}>
        <Form layout="inline">
          <Form.Item label="上传类型">
            <Select
              defaultValue={uploadFileType}
              options={fileUploadTypeOptions}
              onChange={handleSelectChange}
            />
          </Form.Item>
          <Form.Item>
            <Upload {...UploadProps}>
              <Button icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
          </Form.Item>

        </Form>

      </div>
      <Table
        rowKey={(record) => record._id}
        dataSource={tableData}
        columns={columns}
        pagination={{ ...paginationConfig, total }}
        loading={tableLoading}
        onChange={handleTableChange}
      ></Table>
    </Card>
  );
}
