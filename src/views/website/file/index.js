import ApiUrl from "@/config/api-url";
import { fetchUploadList } from "@/services/websit";
import { getToken } from "@/utils/request";
import { formatDate } from "@/utils/utils";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Card, message, Table, Upload } from "antd";
import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

export default function FileAdmin() {
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [total, setTotal] = useState(0);
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

  const byte2kb = (val) => (val / 1024).toFixed(2);
  const columns = [
    {
      title: "文件名",
      dataIndex: "name",
    },
    {
      title: "预览",
      render: (text, record) => (
        <div>
          <img
            alt=""
            style={{ width: 50 }}
            src={`${ApiUrl.ManApiUrl}${record.filePath.replace("public", "")}`}
          />
        </div>
      ),
    },
    {
      title: "文件路径",
      render: (text, record) => (
        <CopyToClipboard
          text={`${ApiUrl.ManApiUrl}${record.filePath.replace("public", "")}`}
          onCopy={() => message.success("复制文本成功！")}
        >
          <span style={{ cursor: "pointer" }}>{`${
            ApiUrl.ManApiUrl
          }${record.filePath.replace("public", "")}`}</span>
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
    action: `${ApiUrl.ManApiUrl}/file/upload`,
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

  return (
    <Card>
      <div style={{marginBottom:'6px'}}>
        <Upload {...UploadProps}>
          <Button icon={<UploadOutlined/>}>上传</Button>
        </Upload>
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
