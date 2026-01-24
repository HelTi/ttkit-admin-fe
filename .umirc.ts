import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './home',
      icon: 'HomeOutlined',
    },
    {
      name: '登录',
      path: '/login',
      component: './login',
      layout: false,
    },
    {
      name: '文章管理',
      path: '/article',
      component: './article',
      icon: 'FileTextOutlined',
      routes: [
        {
          name: '文章列表',
          path: '/article/list',
          component: './article/list',
          icon: 'UnorderedListOutlined',
        },
        {
          name: '文章标签',
          path: '/article/tags',
          component: './article/tags',
          icon: 'TagsOutlined',
        },
        {
          name: '推荐文章',
          path: '/article/recommend',
          component: './article/recommend',
          icon: 'StarOutlined',
        },
        {
          name: '新增文章',
          path: '/article/add',
          component: './article/add',
          hideInMenu: true,
        },
      ],
    },
    {
      name: '网站管理',
      path: '/website',
      component: './website',
      icon: 'GlobalOutlined',
      routes: [
        {
          name: '文件管理',
          path: '/website/file',
          component: './website/file',
          icon: 'FolderOutlined',
        },
        {
          name: '工具集菜单',
          path: '/website/tool-menus',
          component: './website/tool-menus',
          icon: 'ToolOutlined',
        },
        {
          name: 'API 调用历史',
          path: '/website/api-call-history',
          component: './website/api-call-history',
          icon: 'HistoryOutlined',
        },
        {
          name: '访客统计',
          path: '/website/visitor',
          component: './website/visitor',
          icon: 'BarChartOutlined',
        },
        {
          name: 'OpenAI 平台配置',
          path: '/website/openai-platform',
          component: './website/openai-platform',
          icon: 'ThunderboltOutlined',
        },
        {
          name: 'Prompt模板',
          path: '/website/prompt-template',
          component: './website/prompt-template',
          icon: 'CodeOutlined',
        },
      ],
    },
    {
      name: '个人设置',
      path: '/user/settings',
      component: './user/settings',
      hideInMenu: true,
    },
    {
      name: '修改密码',
      path: '/user/password',
      component: './user/password',
      hideInMenu: true,
    },
  ],
  npmClient: 'npm',
});

