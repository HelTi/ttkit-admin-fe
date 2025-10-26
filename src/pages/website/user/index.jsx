import { queryUserList,queryDelteUserById } from '@/services/user';
import { Table, Space, Tag, message, Button, Modal } from 'antd';
import { useState, useEffect, useCallback } from 'react';

export default function User() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => <p>共 {total} 条数据</p>,
  });
  const [total, setTotal] = useState(0);

  // 表格列定义
  const columns = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      ellipsis: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: true,
    },
    {
      title: '昵称',
      dataIndex: 'nick_name',
      key: 'nick_name',
      width: 120,
      ellipsis: true,
    },
    {
      title: '用户类型',
      dataIndex: 'user_type',
      key: 'user_type',
      width: 100,
      render: (type) => (
        <Tag color={type === 0 ? 'red' : 'blue'}>
          {type === 0 ? '超级管理员' : '普通用户'}
        </Tag>
      ),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 180,
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
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
                onOk: () => handleDelete(record._id)
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 模拟获取用户数据的函数
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const params = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    }
    try {
      const res = await queryUserList(params);
      const { data } = res;
      if (Array.isArray(data?.data)) {
        setUsers(data.data);
        setTotal(data?.count || 0);
      } else {
        message.error("获取用户列表失败");
      }
    } catch (error) {
      message.error("获取用户列表失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [pagination])
  // 处理表格变化（分页、筛选、排序）
  const handleTableChange = (pagination) => {
    setPagination((prevConfig) => ({
      ...prevConfig,
      ...pagination,
    }));
  };

  // 首次加载时获取数据
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 在 User 组件内添加删除处理函数
  const handleDelete = async (userId) => {
    try {
      await queryDelteUserById(userId);
      message.success('删除成功');
      fetchUsers()
    } catch (error) {
      console.log('error',error)
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-6">用户管理</h1>
      <Table
        columns={columns}
        dataSource={users}
        rowKey={(record) => record._id}
        pagination={{ ...pagination, total }}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}  // 添加水平滚动
        bordered  // 可选：添加边框使表格更清晰
      />
    </div>
  );
}