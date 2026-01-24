import {
  createPreset,
  createTemplate,
  deletePreset,
  deleteTemplate,
  fetchPresetList,
  fetchTemplateList,
  updatePreset,
  updateTemplate,
  type Preset,
  type PresetFormValues,
  type Template,
  type TemplateFormValues,
} from '@/services/prompt-template';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { Button, Form, Modal, Space, Switch, Tabs, message } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type TabKey = 'template' | 'preset';

/** 模版选项（下拉） */
interface TemplateOption {
  label: string;
  value: string;
  description?: string;
}

const PromptTemplate: React.FC = () => {
  const [templateForm] = Form.useForm<TemplateFormValues>();
  const [presetForm] = Form.useForm<PresetFormValues>();
  const templateActionRef = useRef<ActionType>();
  const presetActionRef = useRef<ActionType>();

  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [isPresetModalVisible, setIsPresetModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);
  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('template');

  /** 获取所有模版（用于预设的所属模版下拉） */
  const fetchAllTemplates = useCallback(async () => {
    try {
      const res = await fetchTemplateList({
        page: 1,
        limit: 1000,
        is_active: true,
      });
      const list = res.data?.data;
      if (Array.isArray(list)) {
        setTemplateOptions(
          list.map((t) => ({
            label: t.name,
            value: t._id,
            description: t.description,
          })),
        );
      }
    } catch {
      message.error('获取模版列表失败');
    }
  }, []);

  const handleEditTemplate = useCallback((record: Template) => {
    setEditingTemplate(record);
    templateForm.setFieldsValue({
      ...record,
      is_active: record.is_active ?? true,
    });
    setIsTemplateModalVisible(true);
  }, [templateForm]);

  const handleEditPreset = useCallback((record: Preset) => {
    setEditingPreset(record);
    const tid =
      typeof record.template_id === 'object' && record.template_id !== null
        ? record.template_id._id
        : record.template_id;
    presetForm.setFieldsValue({
      ...record,
      template_id: tid,
      is_active: record.is_active ?? true,
    });
    setIsPresetModalVisible(true);
  }, [presetForm]);

  const handleDeleteTemplate = useCallback((record: Template) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除模版 "${record.name}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteTemplate(record._id);
          message.success('删除成功');
          templateActionRef.current?.reload();
        } catch {
          message.error('删除失败');
        }
      },
    });
  }, []);

  const handleDeletePreset = useCallback((record: Preset) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除预设 "${record.name}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deletePreset(record._id);
          message.success('删除成功');
          presetActionRef.current?.reload();
        } catch {
          message.error('删除失败');
        }
      },
    });
  }, []);

  const handleTemplateSubmit = useCallback(
    async (values: TemplateFormValues) => {
      try {
        if (editingTemplate) {
          await updateTemplate(editingTemplate._id, values);
          message.success('更新成功');
        } else {
          await createTemplate(values);
          message.success('创建成功');
        }
        fetchAllTemplates();
        templateActionRef.current?.reload();
        return true;
      } catch {
        message.error(editingTemplate ? '更新失败' : '创建失败');
        return false;
      }
    },
    [editingTemplate, fetchAllTemplates],
  );

  const handlePresetSubmit = useCallback(
    async (values: PresetFormValues) => {
      try {
        if (editingPreset) {
          await updatePreset(editingPreset._id, values);
          message.success('更新成功');
        } else {
          await createPreset(values);
          message.success('创建成功');
        }
        presetActionRef.current?.reload();
        return true;
      } catch {
        message.error(editingPreset ? '更新失败' : '创建失败');
        return false;
      }
    },
    [editingPreset],
  );

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key as TabKey);
  }, []);

  const templateColumns: ProColumns<Template>[] = [
    { title: '模版名称', dataIndex: 'name', key: 'name', width: 150, ellipsis: true },
    { title: '描述', dataIndex: 'description', key: 'description', width: 200, ellipsis: true },
    { title: '内容', dataIndex: 'content', key: 'content', width: 300, ellipsis: true },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (_, r) => <Switch checked={!!r.is_active} disabled />,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 180,
      render: (_, r) =>
        r.create_time ? dayjs(r.create_time).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEditTemplate(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDeleteTemplate(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const presetColumns: ProColumns<Preset>[] = [
    { title: '预设名称', dataIndex: 'name', key: 'name', width: 150, ellipsis: true },
    {
      title: '所属模版',
      dataIndex: ['template_id', 'name'],
      key: 'template_name',
      width: 150,
      render: (_, r) =>
        typeof r.template_id === 'object' && r.template_id !== null
          ? r.template_id.name
          : '-',
    },
    { title: '描述', dataIndex: 'description', key: 'description', width: 200, ellipsis: true },
    { title: '内容', dataIndex: 'content', key: 'content', width: 300, ellipsis: true },
    {
      title: '状态',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (_, r) => <Switch checked={!!r.is_active} disabled />,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 180,
      render: (_, r) =>
        r.create_time ? dayjs(r.create_time).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEditPreset(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDeletePreset(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchAllTemplates();
  }, [fetchAllTemplates]);

  return (
    <PageContainer
      ghost
    >
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        destroyOnHidden
        items={[
          {
            key: 'template',
            label: '模版管理',
            children: (
              <>
                <ProTable<Template>
                  actionRef={templateActionRef}
                  rowKey="_id"
                  columns={templateColumns}
                  search={false}
                  scroll={{ x: 1300 }}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 条数据`,
                  }}
                  toolBarRender={() => [
                    <Button
                      key="add"
                      type="primary"
                      onClick={() => {
                        setEditingTemplate(null);
                        templateForm.resetFields();
                        templateForm.setFieldsValue({ is_active: true });
                        setIsTemplateModalVisible(true);
                      }}
                    >
                      添加模版
                    </Button>,
                  ]}
                  request={async (params) => {
                    const { current = 1, pageSize = 10 } = params;
                    try {
                      const res = await fetchTemplateList({
                        page: current,
                        limit: pageSize,
                      });
                      const d = res.data;
                      const list = Array.isArray(d?.data) ? d.data : [];
                      const total = d?.count ?? 0;
                      return { data: list, total, success: (res as { code?: number }).code === 200 };
                    } catch {
                      message.error('获取数据失败');
                      return { data: [], total: 0, success: false };
                    }
                  }}
                />

                <ModalForm<TemplateFormValues>
                  form={templateForm}
                  title={editingTemplate ? '编辑模版' : '添加模版'}
                  open={isTemplateModalVisible}
                  onOpenChange={(open) => {
                    setIsTemplateModalVisible(open);
                    if (!open) {
                      templateForm.resetFields();
                      setEditingTemplate(null);
                    }
                  }}
                  onFinish={handleTemplateSubmit}
                  width={600}
                  modalProps={{ destroyOnClose: true }}
                >
                  <ProFormText
                    name="name"
                    label="模版名称"
                    placeholder="请输入模版名称"
                    rules={[{ required: true, message: '请输入模版名称' }]}
                  />
                  <ProFormTextArea
                    name="description"
                    label="描述"
                    placeholder="请输入描述信息"
                  />
                  <ProFormTextArea
                    name="content"
                    label="内容"
                    placeholder="请输入模版内容"
                    fieldProps={{ rows: 4 }}
                    rules={[{ required: true, message: '请输入模版内容' }]}
                  />
                  <ProFormSwitch
                    name="is_active"
                    label="是否启用"
                    initialValue={true}
                  />
                </ModalForm>
              </>
            ),
          },
          {
            key: 'preset',
            label: '预设管理',
            children: (
              <>
                <ProTable<Preset>
                  actionRef={presetActionRef}
                  rowKey="_id"
                  columns={presetColumns}
                  search={false}
                  scroll={{ x: 1300 }}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 条数据`,
                  }}
                  toolBarRender={() => [
                    <Button
                      key="add"
                      type="primary"
                      onClick={() => {
                        setEditingPreset(null);
                        presetForm.resetFields();
                        presetForm.setFieldsValue({ is_active: true });
                        setIsPresetModalVisible(true);
                      }}
                    >
                      添加预设
                    </Button>,
                  ]}
                  request={async (params) => {
                    const { current = 1, pageSize = 10 } = params;
                    try {
                      const res = await fetchPresetList({
                        page: current,
                        limit: pageSize,
                      });
                      const d = res.data;
                      const list = Array.isArray(d?.data) ? d.data : [];
                      const total = d?.count ?? 0;
                      return { data: list, total, success: (res as { code?: number }).code === 200 };
                    } catch {
                      message.error('获取数据失败');
                      return { data: [], total: 0, success: false };
                    }
                  }}
                />

                <ModalForm<PresetFormValues>
                  form={presetForm}
                  title={editingPreset ? '编辑预设' : '添加预设'}
                  open={isPresetModalVisible}
                  onOpenChange={(open) => {
                    setIsPresetModalVisible(open);
                    if (!open) {
                      presetForm.resetFields();
                      setEditingPreset(null);
                    }
                  }}
                  onFinish={handlePresetSubmit}
                  width={600}
                  modalProps={{ destroyOnClose: true }}
                >
                  <ProFormText
                    name="name"
                    label="预设名称"
                    placeholder="请输入预设名称"
                    rules={[{ required: true, message: '请输入预设名称' }]}
                  />
                  <ProFormSelect
                    name="template_id"
                    label="所属模版"
                    placeholder="请选择所属模版"
                    options={templateOptions}
                    fieldProps={{
                      showSearch: true,
                      filterOption: (input, option) =>
                        (option?.label ?? '')
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase()),
                    }}
                    rules={[{ required: true, message: '请选择所属模版' }]}
                  />
                  <ProFormTextArea
                    name="description"
                    label="描述"
                    placeholder="请输入描述信息"
                  />
                  <ProFormTextArea
                    name="content"
                    label="内容"
                    placeholder="请输入预设内容"
                    fieldProps={{ rows: 4 }}
                    rules={[{ required: true, message: '请输入预设内容' }]}
                  />
                  <ProFormSwitch
                    name="is_active"
                    label="是否启用"
                    initialValue={true}
                  />
                </ModalForm>
              </>
            ),
          },
        ]}
      />
    </PageContainer>
  );
};

export default PromptTemplate;
