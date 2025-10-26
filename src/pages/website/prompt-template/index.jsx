import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Button, Space, Modal, Form, Input,
  Switch, message, Card, Row, Col, Tabs, Select
} from 'antd';
import {
  fetchTemplateList, createTemplate,
  updateTemplate, deleteTemplate,
  fetchPresetList, createPreset,
  updatePreset, deletePreset
} from '@/services/prompt-template';

const { TabPane } = Tabs;

const PromptTemplate = () => {
  const [templateForm] = Form.useForm();
  const [presetForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [templateData, setTemplateData] = useState([]);
  const [presetData, setPresetData] = useState([]);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [isPresetModalVisible, setIsPresetModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editingPreset, setEditingPreset] = useState(null);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [activeTab, setActiveTab] = useState('template');

  // 分离模版和预设的分页状态
  const [templatePagination, setTemplatePagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => <p>共 {total} 条数据</p>,
  });

  const [presetPagination, setPresetPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => <p>共 {total} 条数据</p>,
  });

  const [templateTotal, setTemplateTotal] = useState(0);
  const [presetTotal, setPresetTotal] = useState(0);

  // 模版表格列定义
  const templateColumns = [
    {
      title: '模版名称',
      dataIndex: 'name',
      key: 'name',
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
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 300,
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
          <Button type="link" onClick={() => handleEditTemplate(record)}>
            编辑
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteTemplate(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 预设表格列定义
  const presetColumns = [
    {
      title: '预设名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '所属模版',
      dataIndex: ['template_id', 'name'],
      key: 'template_name',
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
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 300,
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
          <Button type="link" onClick={() => handleEditPreset(record)}>
            编辑
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeletePreset(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 获取所有模版用于下拉选项
  const fetchAllTemplates = useCallback(async () => {
    try {
      const res = await fetchTemplateList({
        page: 1,
        limit: 1000, // 获取足够多的模版用于下拉
        is_active: true, // 只获取激活的模版
      });
      const { data } = res;
      if (Array.isArray(data?.data)) {
        setTemplateOptions(data.data.map(template => ({
          label: template.name,
          value: template._id,
          description: template.description
        })));
      }
    } catch (error) {
      message.error('获取模版列表失败');
    }
  }, []);

  // 获取模版数据
  const fetchTemplateData = useCallback(async () => {
    if (activeTab !== 'template') return; // 只在模版标签页活跃时获取数据
    
    setLoading(true);
    try {
      const res = await fetchTemplateList({
        page: templatePagination.current,
        limit: templatePagination.pageSize,
      });
      const { data } = res;
      if (Array.isArray(data?.data)) {
        setTemplateData(data.data);
        setTemplateTotal(data?.count || 0);
      } else {
        message.error("获取数据失败");
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  }, [activeTab, templatePagination]);

  // 获取预设数据
  const fetchPresetData = useCallback(async () => {
    if (activeTab !== 'preset') return; // 只在预设标签页活跃时获取数据
    
    setLoading(true);
    try {
      const res = await fetchPresetList({
        page: presetPagination.current,
        limit: presetPagination.pageSize,
      });
      const { data } = res;
      if (Array.isArray(data?.data)) {
        setPresetData(data.data);
        setPresetTotal(data?.count || 0);
      } else {
        message.error("获取数据失败");
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  }, [activeTab, presetPagination]);

  // 处理模版表格变化
  const handleTemplateTableChange = useCallback((pagination) => {
    setTemplatePagination(prev => ({
      ...prev,
      ...pagination,
    }));
  }, []);

  // 处理预设表格变化
  const handlePresetTableChange = useCallback((pagination) => {
    setPresetPagination(prev => ({
      ...prev,
      ...pagination,
    }));
  }, []);

  // 处理模版编辑
  const handleEditTemplate = useCallback((record) => {
    setEditingTemplate(record);
    templateForm.setFieldsValue(record);
    setIsTemplateModalVisible(true);
  }, [templateForm]);

  // 处理预设编辑
  const handleEditPreset = useCallback((record) => {
    setEditingPreset(record);
    presetForm.setFieldsValue({
      ...record,
      template_id: record.template_id._id
    });
    setIsPresetModalVisible(true);
  }, [presetForm]);

  // 处理模版删除
  const handleDeleteTemplate = useCallback((record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除模版 "${record.name}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteTemplate(record._id);
          message.success('删除成功');
          fetchTemplateData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  }, [fetchTemplateData]);

  // 处理预设删除
  const handleDeletePreset = useCallback((record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除预设 "${record.name}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deletePreset(record._id);
          message.success('删除成功');
          fetchPresetData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  }, [fetchPresetData]);

  // 处理模版表单提交
  const handleTemplateSubmit = useCallback(async () => {
    try {
      const values = await templateForm.validateFields();
      if (editingTemplate) {
        await updateTemplate(editingTemplate._id, values);
        message.success('更新成功');
      } else {
        await createTemplate(values);
        message.success('创建成功');
      }
      setIsTemplateModalVisible(false);
      templateForm.resetFields();
      setEditingTemplate(null);
      fetchTemplateData();
      fetchAllTemplates(); // 更新下拉选项
    } catch (error) {
      message.error(editingTemplate ? '更新失败' : '创建失败');
    }
  }, [editingTemplate, fetchAllTemplates, fetchTemplateData, templateForm]);

  // 处理预设表单提交
  const handlePresetSubmit = useCallback(async () => {
    try {
      const values = await presetForm.validateFields();
      if (editingPreset) {
        await updatePreset(editingPreset._id, values);
        message.success('更新成功');
      } else {
        await createPreset(values);
        message.success('创建成功');
      }
      setIsPresetModalVisible(false);
      presetForm.resetFields();
      setEditingPreset(null);
      fetchPresetData();
    } catch (error) {
      message.error(editingPreset ? '更新失败' : '创建失败');
    }
  }, [editingPreset, fetchPresetData, presetForm]);

  // 处理tab切换
  const handleTabChange = useCallback((key) => {
    setActiveTab(key);
    
    // 切换tab时重置为第一页，但保留其他分页配置
    if (key === 'template') {
      setTemplatePagination(prev => ({
        ...prev,
        current: 1
      }));
    } else if (key === 'preset') {
      setPresetPagination(prev => ({
        ...prev,
        current: 1
      }));
    }
  }, []);

  // 初始化：获取模板下拉选项
  useEffect(() => {
    fetchAllTemplates();
  }, [fetchAllTemplates]);

  // 初始化或分页变化时获取模版数据
  useEffect(() => {
    fetchTemplateData();
  }, [fetchTemplateData]);

  // 初始化或分页变化时获取预设数据
  useEffect(() => {
    fetchPresetData();
  }, [fetchPresetData]);

  return (
    <div className="p-6">
      <Card>
        <Tabs
          defaultActiveKey="template"
          activeKey={activeTab}
          onChange={handleTabChange}
        >
          <TabPane tab="模版管理" key="template">
            <Row justify="end" style={{ marginBottom: 16 }}>
              <Col>
                <Button
                  type="primary"
                  onClick={() => {
                    setEditingTemplate(null);
                    templateForm.resetFields();
                    setIsTemplateModalVisible(true);
                  }}
                >
                  添加模版
                </Button>
              </Col>
            </Row>

            <Table
              columns={templateColumns}
              dataSource={templateData}
              rowKey={record => record._id}
              pagination={{ ...templatePagination, total: templateTotal }}
              loading={loading}
              onChange={handleTemplateTableChange}
              scroll={{ x: 1300 }}
            />

            <Modal
              title={editingTemplate ? '编辑模版' : '添加模版'}
              open={isTemplateModalVisible}
              onOk={handleTemplateSubmit}
              onCancel={() => {
                setIsTemplateModalVisible(false);
                templateForm.resetFields();
                setEditingTemplate(null);
              }}
              width={600}
            >
              <Form
                form={templateForm}
                layout="vertical"
              >
                <Form.Item
                  name="name"
                  label="模版名称"
                  rules={[{ required: true, message: '请输入模版名称' }]}
                >
                  <Input placeholder="请输入模版名称" />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="描述"
                >
                  <Input.TextArea placeholder="请输入描述信息" />
                </Form.Item>

                <Form.Item
                  name="content"
                  label="内容"
                  rules={[{ required: true, message: '请输入模版内容' }]}
                >
                  <Input.TextArea rows={4} placeholder="请输入模版内容" />
                </Form.Item>

                <Form.Item
                  name="is_active"
                  label="是否启用"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                </Form.Item>
              </Form>
            </Modal>
          </TabPane>

          <TabPane tab="预设管理" key="preset">
            <Row justify="end" style={{ marginBottom: 16 }}>
              <Col>
                <Button
                  type="primary"
                  onClick={() => {
                    setEditingPreset(null);
                    presetForm.resetFields();
                    setIsPresetModalVisible(true);
                  }}
                >
                  添加预设
                </Button>
              </Col>
            </Row>

            <Table
              columns={presetColumns}
              dataSource={presetData}
              rowKey={record => record._id}
              pagination={{ ...presetPagination, total: presetTotal }}
              loading={loading}
              onChange={handlePresetTableChange}
              scroll={{ x: 1300 }}
            />

            <Modal
              title={editingPreset ? '编辑预设' : '添加预设'}
              open={isPresetModalVisible}
              onOk={handlePresetSubmit}
              onCancel={() => {
                setIsPresetModalVisible(false);
                presetForm.resetFields();
                setEditingPreset(null);
              }}
              width={600}
            >
              <Form
                form={presetForm}
                layout="vertical"
              >
                <Form.Item
                  name="name"
                  label="预设名称"
                  rules={[{ required: true, message: '请输入预设名称' }]}
                >
                  <Input placeholder="请输入预设名称" />
                </Form.Item>

                <Form.Item
                  name="template_id"
                  label="所属模版"
                  rules={[{ required: true, message: '请选择所属模版' }]}
                >
                  <Select
                    placeholder="请选择所属模版"
                    options={templateOptions}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="描述"
                >
                  <Input.TextArea placeholder="请输入描述信息" />
                </Form.Item>

                <Form.Item
                  name="content"
                  label="内容"
                  rules={[{ required: true, message: '请输入预设内容' }]}
                >
                  <Input.TextArea rows={4} placeholder="请输入预设内容" />
                </Form.Item>

                <Form.Item
                  name="is_active"
                  label="是否启用"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                </Form.Item>
              </Form>
            </Modal>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default PromptTemplate;
