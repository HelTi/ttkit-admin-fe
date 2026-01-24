import {
  createPlatform,
  deletePlatform,
  fetchPlatformList,
  updatePlatform,
} from '@/services/openai-platform';
import {
  PageContainer,
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { Button, Form, Input, message, Modal, Space, Switch } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';

// 查询参数（接口使用 page/limit）
interface QueryParams {
  page?: number;
  limit?: number;
}

// 列表项
interface PlatformItem {
  _id: string;
  model: string;
  openai_api_base_url: string;
  model_uuid: string;
  public_api_key?: string;
  description?: string;
  is_active: boolean;
  create_time: string;
}

// 表单值
interface FormValues {
  model: string;
  openai_api_base_url: string;
  model_uuid: string;
  public_api_key?: string;
  description?: string;
  is_active?: boolean;
}

const OpenaiPlatform: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const actionRef = useRef<ActionType>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PlatformItem | null>(null);

  const handleEdit = (record: PlatformItem) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      is_active: record.is_active ?? true,
    });
    setModalOpen(true);
  };

  const handleDelete = (record: PlatformItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除模型 "${record.model}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deletePlatform(record._id);
          message.success('删除成功');
          actionRef.current?.reload();
        } catch {
          message.error('删除失败');
        }
      },
    });
  };

  const handleOpenAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({ is_active: true });
    setModalOpen(true);
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    form.resetFields();
    setEditingRecord(null);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const model_uuid =
        typeof values.model_uuid === 'string'
          ? values.model_uuid.replace(/^\s+|\s+$/g, '')
          : values.model_uuid;
      const payload = { ...values, model_uuid };

      if (editingRecord) {
        await updatePlatform(editingRecord._id, payload);
        message.success('更新成功');
      } else {
        await createPlatform(payload);
        message.success('创建成功');
      }
      handleModalCancel();
      actionRef.current?.reload();
    } catch (e) {
      if (e && typeof e === 'object' && 'errorFields' in e) return;
      message.error(editingRecord ? '更新失败' : '创建失败');
    }
  };

  const columns: ProColumns<PlatformItem>[] = [
    {
      title: '模型名称',
      dataIndex: 'model',
      key: 'model',
      width: 150,
      search: false,
    },
    {
      title: 'API基础URL',
      dataIndex: 'openai_api_base_url',
      key: 'openai_api_base_url',
      width: 200,
      ellipsis: true,
      search: false,
    },
    {
      title: '模型唯一标识',
      dataIndex: 'model_uuid',
      key: 'model_uuid',
      width: 150,
      search: false,
    },
    {
      title: '公共API key',
      dataIndex: 'public_api_key',
      key: 'public_api_key',
      width: 150,
      ellipsis: true,
      search: false,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      search: false,
      render: (_, record) => <Switch checked={!!record.is_active} disabled />,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 180,
      search: false,
      render: (_, record) =>
        record.create_time
          ? dayjs(record.create_time).format('YYYY-MM-DD HH:mm:ss')
          : '-',
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
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
        title: 'OpenAI 平台配置',
      }}
    >
      <ProTable<PlatformItem, QueryParams>
        actionRef={actionRef}
        rowKey="_id"
        columns={columns}
        search={false}
        scroll={{ x: 1300 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条数据`,
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={handleOpenAdd}>
            添加配置
          </Button>,
        ]}
        request={async (params) => {
          const { current = 1, pageSize = 10 } = params;
          try {
            const res = await fetchPlatformList({
              page: current,
              limit: pageSize,
            });
            const { data } = res;
            const list = Array.isArray(data?.data) ? data.data : [];
            const total = data?.count ?? 0;
            return {
              data: list,
              total,
              success: res.code === 200,
            };
          } catch {
            message.error('获取数据失败');
            return { data: [], total: 0, success: false };
          }
        }}
      />

      <Modal
        title={editingRecord ? '编辑配置' : '添加配置'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={handleModalCancel}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
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
          <Form.Item name="public_api_key" label="公共API key">
            <Input placeholder="请输入公共API key" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea placeholder="请输入描述信息" rows={3} />
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
    </PageContainer>
  );
};

export default OpenaiPlatform;
