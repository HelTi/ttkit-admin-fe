import React, { useEffect, useMemo, useState } from 'react';
import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AntDesignOutlined,
  SettingTwoTone,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Layout, Menu, Spin } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'umi';
import { useUserStore } from '@/store/user';

const { Header, Sider, Content } = Layout;

const menuDefinitions: MenuProps['items'] = [
  { label: '首页', icon: <AppstoreOutlined />, key: '/' },
  {
    label: '文章管理',
    key: 'article',
    icon: <AppstoreOutlined />,
    children: [
      { label: '文章列表', key: '/article/list' },
      { label: '文章标签', key: '/article/tags' },
      { label: '文章推荐位', key: '/article/recommend' },
    ],
  },
  {
    label: '站点管理',
    key: 'websit',
    icon: <AppstoreOutlined />,
    children: [
      { label: '文件管理', key: '/websit/file' },
      { label: '访客统计', key: '/websit/vistor' },
      { label: '工具集菜单', key: '/websit/tool-menus' },
      { label: '用户管理', key: '/user/management' },
      { label: '接口调用历史', key: '/websit/api-call-history' },
      { label: 'OpenAI平台', key: '/websit/openai-platform' },
      { label: 'Prompt模板', key: '/websit/prompt-template' },
    ],
  },
];

const LayoutIndex: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpenKeys, setMenuOpenKeys] = useState<string[]>([]);
  const initUserInfo = useUserStore((state) => state.initUserInfo);
  const userInfo = useUserStore((state) => state.userInfo);

  useEffect(() => {
    initUserInfo();
  }, [initUserInfo]);

  useEffect(() => {
    setMenuOpenKeys([location.pathname]);
  }, [location.pathname]);

  const onClickMenuItem: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  const dropdownItems = useMemo<MenuProps['items']>(
    () => [
      {
        label: <Link to="/user/password">修改密码</Link>,
        key: '0',
      },
      {
        label: <Link to="/user/info">用户信息</Link>,
        key: '1',
      },
      {
        label: <Link to="/login">退出登录</Link>,
        key: '2',
      },
    ],
    [],
  );

  return (
    <Layout style={{ height: '100%' }}>
      <Sider theme="light" trigger={null} collapsible collapsed={collapsed}>
        <div className="sidebar-header">
          <AntDesignOutlined />
          {!collapsed && <span className="admin-name">管理后台</span>}
        </div>
        <Menu
          theme="light"
          mode="inline"
          items={menuDefinitions}
          style={{ height: '100%' }}
          onClick={onClickMenuItem}
          selectedKeys={menuOpenKeys}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }} className="root-header">
          <div>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </div>
          <div className="root-header-right">
            <Avatar src={userInfo?.avatar_url} style={{ marginRight: '6px' }} />
            <Dropdown menu={{ items: dropdownItems }}>
              <span className="user-name" style={{ marginRight: '8px' }}>
                {userInfo?.nick_name}
              </span>
            </Dropdown>

            <div>
              <SettingTwoTone />
            </div>
          </div>
        </Header>
        <Content style={{ padding: 20 }}>
          <React.Suspense fallback={<Spin />}>
            <Outlet />
          </React.Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutIndex;
