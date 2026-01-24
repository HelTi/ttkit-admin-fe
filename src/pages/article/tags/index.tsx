import { addTag, deleteTag, fetchTags, type Tag } from "@/services/article";
import { PageContainer, ProTable, type ProColumns, type ActionType } from "@ant-design/pro-components";
import { Button, Form, Input, message, Modal, Popconfirm } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";

const Tags: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm<{ name: string }>();

  const handleAddTag = async () => {
    try {
      const values = await form.validateFields();
      const hide = message.loading("正在添加标签...");
      const res = await addTag(values.name);
      hide();
      if (res.code === 200) {
        message.success("添加成功");
        setCreateModalVisible(false);
        form.resetFields();
        actionRef.current?.reload();
      } else {
        message.error(res.message || "添加失败");
      }
    } catch (error: any) {
      if (error?.errorFields) {
        // 表单校验错误，不提示接口错误
        return;
      }
      message.error("添加失败，请稍后重试");
    }
  };

  const handleDelete = async (record: Tag) => {
    const hide = message.loading("正在删除标签...");
    try {
      const res = await deleteTag(record._id);
      hide();
      if (res.code === 200) {
        message.success("删除成功");
        actionRef.current?.reload();
      } else {
        message.error(res.message || "删除失败");
      }
    } catch (error) {
      hide();
      message.error("删除失败，请稍后重试");
    }
  };

  const columns: ProColumns<Tag>[] = [
    {
      title: "标签名称",
      dataIndex: "name",
    },
    {
      title: "文章数量",
      dataIndex: "articleCount",
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      valueType: "dateTime",
      render: (_, record) => {
        return record.create_time ? dayjs(record.create_time).format("YYYY-MM-DD HH:mm:ss") : "-";
      },
    },
    {
      title: "操作",
      key: "option",
      valueType: "option",
      render: (_, record) => [
        <Popconfirm
          key="delete"
          title="确认删除该标签吗？"
          onConfirm={() => handleDelete(record)}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer
      ghost
      header={{
        title: "文章标签",
      }}
    >
      <ProTable<Tag>
        rowKey="_id"
        actionRef={actionRef}
        search={false}
        headerTitle="标签列表"
        toolBarRender={() => [
          <Button key="new" type="primary" onClick={() => setCreateModalVisible(true)}>
            新建标签
          </Button>,
        ]}
        request={async () => {
          try {
            const res = await fetchTags();
            return {
              data: res.data || [],
              success: res.code === 200,
            };
          } catch (error) {
            message.error("获取标签列表失败");
            return {
              data: [],
              success: false,
            };
          }
        }}
        columns={columns}
      />

      <Modal
        title="新建标签"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        onOk={handleAddTag}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="标签名称"
            name="name"
            rules={[{ required: true, message: "请输入标签名称" }]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Tags;
