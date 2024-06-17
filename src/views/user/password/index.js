import { userUpdatePassword } from "@/services/user";
import storage from "@/utils/storage";
import { Button, Card, Form, Input } from "antd";
import { message } from "antd/es";
import { useNavigate } from "react-router-dom";

export default function Password() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const res = await userUpdatePassword(values)
    const { code } = res
    if (code === 200) {
      messageApi.open({
        type: 'success',
        content: '修改密码成功！',
      })
      // 移除token
      storage.remove('token')

      setTimeout(() => {
        navigate('/login')
      }, 1000);

    }
  };

  return (
    <Card title='修改密码' bordered={false}>
      {contextHolder}
      <Form labelCol={{ span: 2 }} onFinish={onFinish}>
        <Form.Item
          name='oldPassword'
          label='原密码'
          rules={[{ required: true, message: '请输入原密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name='newPassword'
          label='新密码'
          rules={[{ required: true, message: '请输入新密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name='confirmPassword'
          label='再次输入密码'
          dependencies={['newPassword']} // 依赖新密码字段
          rules={[
            {
              required: true,
              message: '请再次输入新密码!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
