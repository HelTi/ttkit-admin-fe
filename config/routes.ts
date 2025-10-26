export default [
  {
    path: '/login',
    component: '@/pages/login',
    layout: false,
    meta: {
      roles: [],
      title: '登录',
      key: 'login',
    },
  },
  {
    path: '/404',
    component: '@/pages/error-pages/404',
    layout: false,
    meta: {
      roles: [],
      title: '404页面',
      key: '404',
    },
  },
  {
    path: '/',
    routes: [
      {
        path: '/',
        component: '@/pages/home',
        meta: {
          roles: ['admin'],
          title: 'admin',
          key: 'admin',
        },
        access: 'canAccessRoute',
        wrappers: ['@/wrappers/auth'],
      },
      {
        path: '/article',
        component: '@/pages/article',
        meta: {
          roles: ['admin'],
          title: '文章管理',
          key: 'article',
        },
        access: 'canAccessRoute',
        wrappers: ['@/wrappers/auth'],
      },
      {
        path: '/article/list',
        component: '@/pages/article/list',
        meta: {
          roles: ['admin'],
          title: '文章列表',
          key: '/article/list',
        },
        access: 'canAccessRoute',
        wrappers: ['@/wrappers/auth'],
      },
      {
        path: '/article/tags',
        component: '@/pages/article/tags',
        meta: {
          roles: ['admin'],
          title: '文章标签',
          key: '/article/tags',
        },
        access: 'canAccessRoute',
        wrappers: ['@/wrappers/auth'],
      },
      {
        path: '/article/add',
        component: '@/pages/article/add',
        meta: {
          roles: ['admin'],
          title: '添加文章',
          key: '/article/add',
        },
        access: 'canAccessRoute',
        wrappers: ['@/wrappers/auth'],
      },
      {
        path: '/article/recommend',
        component: '@/pages/article/recommend',
        meta: {
          roles: ['admin'],
          title: '文章推荐',
          key: '/article/recommend',
        },
        access: 'canAccessRoute',
        wrappers: ['@/wrappers/auth'],
      },
      {
        path: '/websit/file',
        component: '@/pages/website/file',
        meta: {
          roles: ['admin'],
          title: '文件管理',
          key: '/websit/file',
        },
        access: 'canAccessRoute',
        wrappers: ['@/wrappers/auth'],
      },
      {
        path: '/websit/vistor',
        component: '@/pages/website/visitor',
        meta: {
          roles: ['admin'],
          title: '访客统计',
          key: '/websit/vistor',
        },
        access: 'canAccessRoute',
        wrappers: ['@/wrappers/auth'],
      },
      {
        path: '/websit/tool-menus',
        component: '@/pages/website/tool-menus',
        meta: {
          roles: ['admin'],
          title: '工具集菜单',
          key: '/websit/tool-menus',
        },
        access: 'canAccessRoute',
        wrappers: ['@/wrappers/auth'],
      },
      {
        path: '/user/password',
        component: '@/pages/user/password',
        meta: {
          roles: ['admin'],
          title: '修改密码',
          key: '/user/password',
        },
        access: 'canAccessRoute',
        wrappers: ['@/wrappers/auth'],
      },
      {
        path: '/user/info',
        component: '@/pages/user/info',
        meta: {
          roles: ['admin'],
          title: '用户信息',
          key: '/user/info',
        },
        access: 'canAccessRoute',
        wrappers: ['@/wrappers/auth'],
      },
      {
        path: '/user/management',
        component: '@/pages/website/user',
        meta: {
          roles: ['admin'],
          title: '用户管理',
          key: '/user/management',
        },
        access: 'canAccessRoute',
        wrappers: ['@/wrappers/auth'],
      },
      {
        path: '/websit/api-call-history',
        component: '@/pages/website/api-call-history',
        meta: {
          roles: ['admin'],
          title: '接口调用历史',
          key: '/websit/api-call-history',
        },
        access: 'canAccessRoute',
        wrappers: ['@/wrappers/auth'],
      },
      {
        path: '/websit/openai-platform',
        component: '@/pages/website/openai-platform',
        meta: {
          roles: ['admin'],
          title: 'OpenAI平台',
          key: '/websit/openai-platform',
        },
        access: 'canAccessRoute',
        wrappers: ['@/wrappers/auth'],
      },
      {
        path: '/websit/prompt-template',
        component: '@/pages/website/prompt-template',
        meta: {
          roles: ['admin'],
          title: 'Prompt模板',
          key: '/websit/prompt-template',
        },
        access: 'canAccessRoute',
        wrappers: ['@/wrappers/auth'],
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
  },
];
