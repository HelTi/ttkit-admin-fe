import { fetchVisitorList } from '@/services/websit';
import {
  PageContainer,
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { message } from 'antd';
import dayjs from 'dayjs';
import { useRef } from 'react';
import UAParser from 'ua-parser-js';

// 查询参数
interface QueryParams {
  pageNo?: number;
  pageSize?: number;
}

// 访客列表项
interface VisitorItem {
  _id: string;
  route_path: string;
  ip: string;
  address: string;
  browse_time: string;
  user_agent: string;
}

const formatBrowserAgent = (agent: string | undefined): string => {
  if (agent) {
    const ua = new UAParser(agent).getResult();
    const browser = ua.browser.name && ua.browser.version
      ? `${ua.browser.name}-${(ua.browser.major || ua.browser.version)}`
      : '未知浏览器';
    const os = ua.os.name || '未知系统';
    return `${browser}  ${os}`;
  }
  return '未知';
};

const Visitor: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<VisitorItem>[] = [
    {
      title: '页面路径',
      dataIndex: 'route_path',
      ellipsis: true,
    },
    {
      title: '用户IP',
      dataIndex: 'ip',
      width: 140,
    },
    {
      title: '用户区域',
      dataIndex: 'address',
      ellipsis: true,
    },
    {
      title: '访问时间',
      dataIndex: 'browse_time',
      width: 180,
      render: (_, record) =>
        record.browse_time
          ? dayjs(record.browse_time).format('YYYY-MM-DD HH:mm:ss')
          : '-',
    },
    {
      title: '系统信息',
      dataIndex: 'user_agent',
      ellipsis: true,
      render: (_, record) => formatBrowserAgent(record.user_agent),
    },
  ];

  return (
    <PageContainer
      ghost
      header={{
        title: '访客统计',
      }}
    >
      <ProTable<VisitorItem, QueryParams>
        actionRef={actionRef}
        rowKey="_id"
        columns={columns}
        search={false}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条数据`,
        }}
        scroll={{ x: 'max-content' }}
        request={async (params) => {
          const { current = 1, pageSize = 10 } = params;
          try {
            const res = await fetchVisitorList({
              pageNo: current,
              pageSize,
            });
            const { data } = res;
            const list = Array.isArray(data?.data) ? data.data : [];
            const total = data?.count ?? 0;
            return {
              data: list,
              total,
              success: res.code === 200,
            };
          } catch (error) {
            message.error('获取访客列表失败');
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

export default Visitor;
