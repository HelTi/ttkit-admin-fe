import React, { useState, useEffect, useCallback } from 'react';
import { Table, Form, Input, Card, Button, InputNumber } from 'antd';
import { fetchApiCallHistoryList } from '@/services/websit';
import dayjs from 'dayjs';

const ApiCallHistory = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => <p>共 {total} 条数据</p>,
  });

  const [total, setTotal] = useState(0);

  const columns = [
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: '调用时间',
      dataIndex: 'callTime',
      key: 'callTime',
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: 'User Agent',
      dataIndex: 'userAgent',
      key: 'userAgent',
    },
    {
      title: '状态码',
      dataIndex: 'statusCode',
      key: 'statusCode',
    },
    {
      title: '耗时(ms)',
      dataIndex: 'duration',
      key: 'duration',
    },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const {data} = await fetchApiCallHistoryList({
        pageNo: pagination.current,
        pageSize:pagination.pageSize,
        ...values,
      });
      setData(data.data);
      setTotal(data.total)
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally{
      setLoading(false); 
    }
   
  }, [form, pagination]);

  // 处理表格变化（分页、筛选、排序）
  const handleTableChange = (pagination) => {
    setPagination((prevConfig) => ({
      ...prevConfig,
      ...pagination,
    }));
  };

  const handleSearch = ()=>{
    fetchData()
  }

  const handleReset = ()=>{
    form.resetFields();
    setPagination(prev => ({ ...prev, current: 1 }));
  }

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="api-call-history">
      <Card>
        <Form form={form} layout="inline">
          <Form.Item name="url" label="URL">
            <Input placeholder="请输入URL" />
          </Form.Item>
          <Form.Item name="duration" label="耗时">
            <InputNumber placeholder="请输入耗时" />
          </Form.Item>
          <Form.Item name="ip" label="IP地址">
            <Input placeholder="请输入IP地址" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSearch}>
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      <Card style={{ marginTop: 16 }}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ ...pagination, total }}
          onChange={handleTableChange}
          loading={loading}
          rowKey="id"
          scroll={{ x: 'auto' }}  // 添加水平滚动
        />
      </Card>
    </div>
  );
};

export default ApiCallHistory;