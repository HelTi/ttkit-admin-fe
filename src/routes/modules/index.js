import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import Root from "@/layout/root";
import Login from "@/views/login";
import ArticleList from "@/views/article/list";
import NotFound from "@/views/error-pages/404";
const Home = lazy(() => import("@/views/home"));
const Article = lazy(() => import("@/views/article"));
const Tags = lazy(() => import("@/views/article/tags"));
const AddArtile = lazy(() => import("@/views/article/add"));

const ToolMenus = lazy(() => import('@/views/website/tool-menus'))
const FileAdmin = lazy(() => import("@/views/website/file"))
const Visitor = lazy(() => import("@/views/website/visitor"))
const Password = lazy(() => import('@/views/user/password'))
const UserInfo = lazy(() => import('@/views/user/info'))
const RecommendArticle = lazy(() => import('@/views/article/recommend'))


export const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Home />,
        meta: {
          roles: ["admin"],
          title: "admin",
          key: "admin",
        },
      },
      {
        path: "article",
        element: <Article />,
        meta: {
          roles: ["admin"],
          title: "文章管理",
          key: "article",
        },
      },
      {
        path: "/article/list",
        element: <ArticleList />,
        meta: {
          roles: ["admin"],
          title: "文章列表",
          key: "/article/list",
        },
      },
      {
        path: "/article/tags",
        element: <Tags />,
        meta: {
          roles: ["admin"],
          title: "文章标签",
          key: "/article/tags",
        },
      },
      {
        path: "/article/add",
        element: <AddArtile />,
        meta: {
          roles: ["admin"],
          title: "添加文章",
          key: "/article/add",
        },
      },
      {
        path: "/article/recommend",
        element: <RecommendArticle />,
        meta: {
          roles: ["admin"],
          title: "文章推荐",
          key: "/article/recommend",
        },
      },
      {
        path: "/websit/file",
        element: <FileAdmin />,
        meta: {
          roles: ["admin"],
          title: "文件管理",
          key: "/websit/file",
        },
      },
      {
        path: "/websit/vistor",
        element: <Visitor />,
        meta: {
          roles: ["admin"],
          title: "访客统计",
          key: "/websit/vistor",
        },
      },
      {
        path: "/websit/tool-menus",
        element: <ToolMenus />,
        meta: {
          roles: ["admin"],
          title: "工具集菜单",
          key: "/websit/tool-menus",
        },
      }, {
        path: "/user/password",
        element: <Password />,
        meta: {
          roles: ["admin"],
          title: "修改密码",
          key: "/user/password",
        },
      },
      {
        path: '/user/info',
        element: <UserInfo />,
        meta: {
          roles: ["admin"],
          title: "用户信息",
          key: '/user/info'
        }
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      roles: [],
      title: "登录",
      key: "login",
    },
  },
  {
    path: "/404",
    element: <NotFound />,
    meta: {
      roles: [],
      title: "404页面",
      key: "404",
    },
  },
  {
    path: "*",
    element: <Navigate to="/404" />,
  },
];

export default routes;
