import { queryDelteUserById, queryUserList } from '@/services/user';
import { UserRole, type UserInfo } from '@/types/user';
import {
  PageContainer,
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { Button, Modal, Space, Tag, message } from 'antd';
import { useRef } from 'react';

/** 列表项（含后端 _id） */
interface UserListItem extends UserInfo {
  _id: string;
}

/** 列表查询参数（与 ProTable request 对齐） */
interface QueryParams {
  current?: number;
  pageSize?: number;
}

const userTypeLabel = (type: UserRole): string => {
  switch (type) {
    case UserRole.ADMIN:
      return '超级管理员';
    case UserRole.USER:
      return '普通用户';
    case UserRole.PUBLIC:
      return '公开访问';
    default:
      return '未知';
  }
};

const UserManage: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<UserListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'name',
      width: 120,
      ellipsis: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 200,
      ellipsis: true,
    },
    {
      title: '昵称',
      dataIndex: 'nick_name',
      width: 120,
      ellipsis: true,
    },
    {
      title: '用户类型',
      dataIndex: 'user_type',
      width: 100,
      render: (_, record) => (
        <Tag color={record.user_type === UserRole.ADMIN ? 'red' : 'blue'}>
          {userTypeLabel(record.user_type)}
        </Tag>
      ),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 80,
      render: (g) =>
        g === null || g === undefined || g === '' ? '-' : String(g),
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      width: 180,
      render: (_, record) =>
        record.create_time
          ? new Date(record.create_time as string).toLocaleString()
          : '-',
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            danger
            size="small"
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: `确定要删除用户 "${record.name}" 吗？`,
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  try {
                    await queryDelteUserById(record._id);
                    message.success('删除成功');
                    actionRef.current?.reload();
                  } catch {
                    message.error('删除失败，请稍后重试');
                  }
                },
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      ghost
      header={{
        title: '用户管理',
      }}
    >
      <ProTable<UserListItem, QueryParams>
        actionRef={actionRef}
        rowKey="_id"
        columns={columns}
        search={false}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条数据`,
        }}
        scroll={{ x: 1000 }}
        bordered
        request={async (params) => {
          const { current = 1, pageSize = 10 } = params;
          try {
            const res = await queryUserList({
              pageNo: current,
              pageSize,
            });
            const { data } = res;
            const list = Array.isArray(data?.data)
              ? data.data
              : Array.isArray(data?.list)
                ? data.list
                : [];
            const total = data?.count ?? data?.total ?? 0;
            return {
              data: list as UserListItem[],
              total,
              success: res.code === 200,
            };
          } catch {
            message.error('获取用户列表失败，请稍后重试');
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

export default UserManage;
