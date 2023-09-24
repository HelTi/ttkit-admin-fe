import React, { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AntDesignOutlined,
  SettingTwoTone,
} from "@ant-design/icons";
import { Dropdown, Layout, Menu } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/user";
import { Avatar } from "antd";
const { Header, Sider, Content } = Layout;

const items = [
  { label: "首页", icon: <AppstoreOutlined />, key: "/", path: "/" }, // 菜单项务必填写 key
  {
    label: "文章管理",
    key: "artile",
    icon: <AppstoreOutlined />,
    children: [
      { label: "文章列表", key: "/article/list" },
      { label: "文章标签", key: "/article/tags" },
    ],
  },
  {
    label: "站点管理",
    key: "websit",
    icon: <AppstoreOutlined />,
    children: [
      { label: "文件管理", key: "/websit/file" },
      { label: "访客统计", key: "/websit/vistor" },
    ],
  },
];

const Root = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [menuOpenKeys, setMenuOpenKeys] = useState([]);
  const initUserInfo = useUserStore((state)=>state.initUserInfo)
  const userInfo = useUserStore((state)=> state.userInfo)

  const dropDownItems = [
    {
      label: <Link to={'/user/password'}>修改密码</Link>,
      key: '0',
    },
    {
      label: <Link to={'/user/info'}>用户信息</Link>,
      key: '1',
    },
    {
      label: <Link to={'/login'}>退出登录</Link>,
      key: '2',
    },
  ]
  
  //初始化全局状态数据
  useEffect(()=>{
    initUserInfo()
  },[initUserInfo])
  useEffect(() => {
    setMenuItems(items);
  }, [menuItems]);

  useEffect(() => {
    console.log("location", location);
    const { pathname } = location;
    setMenuOpenKeys([pathname]);
  }, [location]);

  const onClickMenuItem = (e) => {
    const { key } = e;
    navigate(key);
  };


  return (
    <Layout style={{ height: "100%" }}>
      <Sider theme="light" trigger={null} collapsible collapsed={collapsed}>
        <div className="sidebar-header">
          <AntDesignOutlined />
          {!collapsed && <span className="admin-name">管理后台</span>}
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          style={{
            height: "100%",
          }}
          onClick={onClickMenuItem}
          selectedKeys={menuOpenKeys}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
          }}
          className="root-header"
        >
          <div>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </div>
          <div className="root-header-right">
            <Avatar src={userInfo?.avatar_url} style={{marginRight:'6px'}} />
            <Dropdown
              menu={{
                items: dropDownItems
              }}
            > 
              <span className="user-name" style={{ marginRight: '8px' }}>
                {userInfo?.nick_name}
              </span>
            </Dropdown>

            <div>
              <SettingTwoTone/>
            </div>
          </div>

        </Header>
        <Content
          style={{
            // margin: "20px 10px",
            padding: 20,
          }}
        >
          <React.Suspense fallback={<div>loading</div>}>
            <Outlet />
          </React.Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Root;
