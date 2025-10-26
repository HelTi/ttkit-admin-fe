import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Button, Space, Modal, Form, Input,
  Switch, message, Card, Row, Col
} from 'antd';
import {
  fetchPlatformList, createPlatform,
  updatePlatform, deletePlatform
} from '@/services/openai-platform';

const OpenaiPlatform = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
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
      title: '模型名称',
      dataIndex: 'model',
      key: 'model',
      width: 150,
    },
    {
      title: 'API基础URL',
      dataIndex: 'openai_api_base_url',
      key: 'openai_api_base_url',
      width: 200,
      ellipsis: true,
    },
    {
      title: '模型唯一标识',
      dataIndex: 'model_uuid',
      key: 'model_uuid',
      width: 150,
    },
    {
      title: '公共API key',
      dataIndex: 'public_api_key',
      key: 'public_api_key',
      width: 150,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (active) => (
        <Switch checked={active} disabled />
      ),
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
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 获取数据
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchPlatformList({
        page: pagination.current,
        limit: pagination.pageSize,
      });
      const { data } = res;
      if (Array.isArray(data?.data)) {
        setData(data.data);
        setTotal(data?.count || 0);
      } else {
        message.error("获取数据失败");
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  // 处理表格变化
  const handleTableChange = (pagination) => {
    setPagination(prev => ({
      ...prev,
      ...pagination,
    }));
  };

  // 处理编辑
  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // 处理删除
  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除模型 "${record.model}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deletePlatform(record._id);
          message.success('删除成功');
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 处理添加/编辑表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.model_uuid = values.model_uuid.replace(/^\s+|\s+$/g, '');
      if (editingRecord) {
        await updatePlatform(editingRecord._id, values);
        message.success('更新成功');
      } else {
        await createPlatform(values);
        message.success('创建成功');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingRecord(null);
      fetchData();
    } catch (error) {
      message.error(editingRecord ? '更新失败' : '创建失败');
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-6">
      <Card>
        <Row justify="end" style={{ marginBottom: 16 }}>
          <Col>
            <Button
              type="primary"
              onClick={() => {
                setEditingRecord(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
            >
              添加配置
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={data}
          rowKey={record => record._id}
          pagination={{ ...pagination, total }}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 1300 }}
        />

        <Modal
          title={editingRecord ? '编辑配置' : '添加配置'}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setEditingRecord(null);
          }}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="model"
              label="模型名称"
              rules={[{ required: true, message: '请输入模型名称' }]}
            >
              <Input placeholder="请输入模型名称" />
            </Form.Item>

            <Form.Item
              name="openai_api_base_url"
              label="API基础URL"
              rules={[{ required: true, message: '请输入API基础URL' }]}
            >
              <Input placeholder="请输入API基础URL" />
            </Form.Item>

            <Form.Item
              name="model_uuid"
              label="模型唯一标识"
              rules={[{ required: true, message: '请输入模型唯一标识' }]}
            >
              <Input placeholder="请输入模型唯一标识" />
            </Form.Item>

            <Form.Item
              name="public_api_key"
              label="公共API key"
            >
              <Input placeholder="请输入公共API key" />
            </Form.Item>
            <Form.Item
              name="description"
              label="描述"
            >
              <Input.TextArea placeholder="请输入描述信息" />
            </Form.Item>

            <Form.Item
              name="is_active"
              label="是否激活"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default OpenaiPlatform;
