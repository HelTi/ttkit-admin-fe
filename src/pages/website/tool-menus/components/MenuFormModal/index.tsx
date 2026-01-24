import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Cascader,
  Radio,
  Upload,
  Button,
  InputNumber,
  Row,
  Col,
  message,
} from 'antd';
import { RedoOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import ApiUrl from '@/config/api-url';
import { getToken } from '@/utils/request';
import type { FormValues } from '../../types';
import type { TreeNode } from '@/utils/utils';

interface MenuFormModalProps {
  visible: boolean;
  menuCategory: TreeNode[];
  initialValues?: FormValues;
  imageUrl?: string;
  onSave: (values: FormValues) => Promise<boolean>;
  onCancel: () => void;
  onFetchWebsiteInfo?: (url: string) => Promise<{ iconUrl?: string; description?: string } | null>;
}

const defaultFormValue: FormValues = {
  isMenuCategory: false,
};

const MenuFormModal: React.FC<MenuFormModalProps> = ({
  visible,
  menuCategory,
  initialValues,
  imageUrl: initialImageUrl,
  onSave,
  onCancel,
  onFetchWebsiteInfo,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
        setImageUrl(initialImageUrl || initialValues.menuIcon || '');
      } else {
        form.setFieldsValue(defaultFormValue);
        setImageUrl('');
      }
    } else {
      form.resetFields();
      setImageUrl('');
    }
  }, [visible, initialValues, initialImageUrl, form]);

  const UploadProps: UploadProps = {
    name: 'file',
    action: `${ApiUrl.ManApiUrl}/file/upload`,
    headers: {
      Authorization: getToken() || '',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success('上传文件成功！');
        const url = ApiUrl.ManApiUrl + '/' + info?.file?.response?.data?.filePath;
        setImageUrl(url);
        form.setFieldValue('menuIcon', url);
      } else if (info.file.status === 'error') {
        message.error('上传文件失败');
      }
    },
  };

  const normFile = (e: any): string => {
    if (Array.isArray(e)) {
      return e[0]?.url || e[0]?.response?.data?.filePath || '';
    }
    return ApiUrl.ManApiUrl + '/' + e?.file?.response?.data?.filePath;
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const success = await onSave(values);
      if (success) {
        form.resetFields();
        setImageUrl('');
        onCancel();
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImageUrl('');
    onCancel();
  };

  const onFetchInfo = async () => {
    const menuUrl = form.getFieldValue('menuUrl');
    if (!menuUrl) {
      message.warning('请先输入网址');
      return;
    }

    if (onFetchWebsiteInfo) {
      const result = await onFetchWebsiteInfo(menuUrl);
      if (result) {
        if (result.iconUrl) {
          form.setFieldValue('menuIcon', result.iconUrl);
          setImageUrl(result.iconUrl);
        }
        if (result.description) {
          form.setFieldValue('desc', result.description);
        }
      }
    }
  };

  // 网址输入框
  const UrlInput = (props: any) => (
    <Row gutter={4}>
      <Col span={20}>
        <Input {...props} />
      </Col>
      <Col span={4}>
        <Button
          onClick={onFetchInfo}
          type="primary"
          icon={<RedoOutlined />}
        ></Button>
      </Col>
    </Row>
  );

  return (
    <Modal
      title="添加菜单"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        labelCol={{ flex: '126px' }}
        labelAlign="right"
        labelWrap
        initialValues={defaultFormValue}
      >
        <Form.Item label="是否是菜单类目" name="isMenuCategory">
          <Radio.Group disabled>
            <Radio value={false}>否</Radio>
            <Radio value={true}>是</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="submitParentMenuCode"
          label="上级菜单编码"
          rules={[
            {
              required: false,
              message: '上级菜单编码来自左侧侧选择的菜单',
            },
          ]}
        >
          <Cascader
            fieldNames={{ label: 'menuName', value: 'menuCode' }}
            options={menuCategory}
            changeOnSelect
          />
        </Form.Item>
        <Form.Item
          name="menuName"
          label="菜单名称"
          rules={[{ required: true, message: '请输入菜单名称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="desc" label="描述">
          <Input.TextArea rows={2} placeholder="备注" />
        </Form.Item>

        <Form.Item name="sort_num" label="排序大小">
          <InputNumber placeholder="排序大小" />
        </Form.Item>

        <Form.Item name="menuCode" label="菜单编码">
          <Input disabled={true} placeholder={'菜单编码，自动生成'} />
        </Form.Item>
        <Form.Item
          label="菜单图标"
          name="menuIcon"
          rules={[{ required: false, message: '请输入菜单图标' }]}
          getValueFromEvent={normFile}
          valuePropName="file"
        >
          <Upload {...UploadProps}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                style={{
                  width: 60,
                  height: 60,
                }}
              />
            ) : (
              <Button icon={<UploadOutlined />}>上传</Button>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          name="menuUrl"
          label="菜单URL"
          rules={[
            { required: false, message: '请输入菜单URL' },
            { type: 'url' },
          ]}
        >
          <UrlInput />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuFormModal;
