import ApiUrl from '@/config/api-url';
import { deleteFile, deleteOssFile } from '@/services/upload';
import { fetchUploadList } from '@/services/websit';
import { getToken } from '@/utils/request';
import { UploadOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { Button, message, Modal, Select, Upload } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';

const { confirm } = Modal;

// 文件上传类型选项
interface FileUploadTypeOption {
  value: number;
  label: string;
}

// 文件列表项类型
interface FileItem {
  _id: string;
  name: string;
  filePath: string;
  size: number;
  upload_date: string;
  type: number; // 1: 本地上传, 2: oss上传
}

// 分页参数类型
interface PaginationParams {
  pageNo: number;
  pageSize: number;
}

const FileAdmin: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [uploadFileType, setUploadFileType] = useState<number>(2);

  const fileUploadTypeOptions: FileUploadTypeOption[] = [
    { value: 2, label: 'oss上传' },
    { value: 1, label: '本地上传' },
  ];

  // 字节转KB
  const byte2kb = (val: number): string => (val / 1024).toFixed(2);

  // 设置文件地址
  const setFileUrl = (record: FileItem): string => {
    // oss地址
    if (record?.type === 2) {
      return record.filePath;
    } else {
      // 本地上传地址
      return `${ApiUrl.ManApiUrl}${record.filePath.replace('public', '')}`;
    }
  };

  // 删除文件
  const handleDeleteFile = async (
    fileName: string,
    type: number,
    fileId: string,
  ) => {
    confirm({
      title: '警告！',
      content: '确定要删除此文件吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        let res = null;
        if (type === 2) {
          res = await deleteOssFile(fileName, fileId);
        } else {
          res = await deleteFile(fileId);
        }
        if (res.code === 200) {
          message.success('删除文件成功！');
          actionRef.current?.reload();
        } else {
          message.error('删除失败');
        }
      },
      onCancel() {},
    });
  };

  // 上传配置
  const uploadProps: {
    name: string;
    maxCount: number;
    action: string;
    headers: { Authorization: string };
    onChange: (info: any) => void;
  } = {
    name: 'file',
    maxCount: 1,
    action:
      uploadFileType === 1
        ? `${ApiUrl.ManApiUrl}/file/upload`
        : `${ApiUrl.ManApiUrl}/oss/upload`,
    headers: {
      Authorization: getToken() || '',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success('上传文件成功！');
        actionRef.current?.reload();
      } else if (info.file.status === 'error') {
        message.error('上传文件失败');
      }
    },
  };

  // 切换文件上传类型
  const handleSelectChange = (value: number) => {
    setUploadFileType(value);
  };

  const columns: ProColumns<FileItem>[] = [
    {
      title: '文件名',
      dataIndex: 'name',
      width: 160,
      ellipsis: true,
      search: false,
    },
    {
      title: '预览',
      width: 100,
      search: false,
      render: (_, record) => (
        <div>
          <img alt="" style={{ width: 80, height: 80, objectFit: 'cover' }} src={setFileUrl(record)} />
        </div>
      ),
    },
    {
      title: '文件路径',
      width: 200,
      ellipsis: true,
      copyable: true,
      search: false,
      render: (_, record) => setFileUrl(record),
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      width: 120,
      search: false,
      render: (_, record) => `${byte2kb(record.size)}kb`,
    },
    {
      title: '上传时间',
      dataIndex: 'upload_date',
      width: 180,
      search: false,
      render: (_, record) => (
        <span>
          {record.upload_date
            ? dayjs(record.upload_date).format('YYYY-MM-DD HH:mm:ss')
            : '-'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'operation',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      search: false,
      render: (_, record) => [
        <Button
          key="delete"
          onClick={() =>
            handleDeleteFile(record.name, record.type, record._id)
          }
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer
      ghost
      header={{
        title: '文件管理',
      }}
    >
      <ProTable<FileItem, PaginationParams>
        actionRef={actionRef}
        rowKey="_id"
        columns={columns}
        scroll={{ x: 920 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        toolBarRender={() => [
          <Select
            key="uploadType"
            value={uploadFileType}
            options={fileUploadTypeOptions}
            onChange={handleSelectChange}
            style={{ width: 120, marginRight: 8 }}
          />,
          <Upload key="upload" {...uploadProps}>
            <Button icon={<UploadOutlined />}>上传文件</Button>
          </Upload>,
        ]}
        search={false}
        request={async (params) => {
          const { current = 1, pageSize = 10 } = params;
          const queryParams: PaginationParams = {
            pageNo: current,
            pageSize: pageSize,
          };
          try {
            const res = await fetchUploadList(queryParams);
            const { data } = res;
            if (Array.isArray(data?.data)) {
              return {
                data: data.data,
                total: data?.count || 0,
                success: res.code === 200,
              };
            }
            return {
              data: [],
              total: 0,
              success: false,
            };
          } catch (error) {
            message.error('获取文件列表失败');
            return {
              data: [],
              total: 0,
              success: false,
            };
          }
        }}
      />
    </PageContainer>
  );
};

export default FileAdmin;
