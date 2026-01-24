import { fetchApiCallHistoryList } from '@/services/websit';
import {
  PageContainer,
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { message } from 'antd';
import dayjs from 'dayjs';
import { useRef } from 'react';

// 查询参数
interface QueryParams {
  pageNo?: number;
  pageSize?: number;
  url?: string;
  duration?: number;
  ip?: string;
}

// 列表项
interface ApiCallHistoryItem {
  id: string;
  url: string;
  method: string;
  callTime: string;
  ip: string;
  userAgent: string;
  statusCode: number;
  duration: number;
}

const ApiCallHistory: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<ApiCallHistoryItem>[] = [
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      width: 240,
      fieldProps: { placeholder: '请输入URL' },
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      width: 100,
      search: false,
    },
    {
      title: '调用时间',
      dataIndex: 'callTime',
      key: 'callTime',
      width: 180,
      search: false,
      render: (_, record) =>
        record.callTime
          ? dayjs(record.callTime).format('YYYY-MM-DD HH:mm:ss')
          : '-',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 140,
      fieldProps: { placeholder: '请输入IP地址' },
    },
    {
      title: 'User Agent',
      dataIndex: 'userAgent',
      key: 'userAgent',
      ellipsis: true,
      width: 200,
      search: false,
    },
    {
      title: '状态码',
      dataIndex: 'statusCode',
      key: 'statusCode',
      width: 90,
      search: false,
    },
    {
      title: '耗时(ms)',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      valueType: 'digit',
      fieldProps: { placeholder: '请输入耗时' },
    },
  ];

  return (
    <PageContainer
      ghost
      header={{
        title: 'API 调用历史',
      }}
    >
      <ProTable<ApiCallHistoryItem, QueryParams>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条数据`,
        }}
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 'max-content' }}
        request={async (params) => {
          const { current = 1, pageSize = 10, url, duration, ip } = params;
          try {
            const res = await fetchApiCallHistoryList({
              pageNo: current,
              pageSize,
              url,
              duration,
              ip,
            });
            const { data } = res;
            const list = Array.isArray(data?.data) ? data.data : [];
            const total = data?.total ?? 0;
            return {
              data: list,
              total,
              success: res.code === 200,
            };
          } catch (error) {
            message.error('获取数据失败');
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

export default ApiCallHistory;
