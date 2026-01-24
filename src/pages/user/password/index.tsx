import { userUpdatePassword } from '@/services/user';
import type { UpdatePasswordParams } from '@/types/user';
import storage from '@/utils/storage';
import { PageContainer, ProForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useNavigate } from 'umi';

interface PasswordFormValues extends UpdatePasswordParams {
  confirmPassword: string;
}

export default function Password() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish = async (values: PasswordFormValues) => {
    const { oldPassword, newPassword } = values;
    const res = await userUpdatePassword({ oldPassword, newPassword });
    const { code } = res;
    if (code === 200) {
      messageApi.open({
        type: 'success',
        content: '修改密码成功！',
      });
      // 移除token
      storage.remove('token');

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }
  };

  return (
    <PageContainer>
      {contextHolder}
      <ProForm<PasswordFormValues>
        onFinish={onFinish}
        submitter={{
          searchConfig: {
            submitText: '确定',
          },
        }}
      >
        <ProFormText.Password
          name="oldPassword"
          label="原密码"
          placeholder="请输入原密码"
          rules={[{ required: true, message: '请输入原密码' }]}
        />
        <ProFormText.Password
          name="newPassword"
          label="新密码"
          placeholder="请输入新密码"
          rules={[{ required: true, message: '请输入新密码' }]}
        />
        <ProFormText.Password
          name="confirmPassword"
          label="再次输入密码"
          placeholder="请再次输入新密码"
          dependencies={['newPassword']}
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
        />
      </ProForm>
    </PageContainer>
  );
}
