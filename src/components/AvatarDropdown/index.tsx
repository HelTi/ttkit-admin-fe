import { LogoutOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
import { useNavigate } from '@umijs/max';
import storage from '@/utils/storage';
import { ReactNode } from 'react';

interface AvatarDropdownProps {
  dom: ReactNode;
}

const AvatarDropdown: React.FC<AvatarDropdownProps> = ({ dom }) => {
  const navigate = useNavigate();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'password':
        navigate('/user/password');
        break;
      case 'settings':
        navigate('/user/settings');
        break;
      case 'logout':
        // 清除本地 token 数据
        storage.remove('token');
        navigate('/login');
        break;
      default:
        break;
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'password',
      icon: <LockOutlined />,
      label: '修改密码',
    },
    {
      key: 'settings',
      icon: <UserOutlined />,
      label: '用户信息',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: handleMenuClick,
      }}
      placement="bottomRight"
    >
      <span style={{ cursor: 'pointer' }}>{dom}</span>
    </Dropdown>
  );
};

export default AvatarDropdown;

