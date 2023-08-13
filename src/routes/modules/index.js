import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import Root from "@/layout/root";
import Login from "@/views/login";
import ArticleList from "@/views/article/list";
import NotFound from "@/views/error-pages/404";
import Ai from "@/views/ai";
const Home = lazy(() => import("@/views/home"));
const Article = lazy(() => import("@/views/article"));
const Tags = lazy(() => import("@/views/article/tags"));
const AddArtile = lazy(() => import("@/views/article/add"));
const FileAdmin = lazy(()=>import("@/views/website/file"))
const Visitor = lazy(()=>import("@/views/website/visitor"))

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
        path: "/ai",
        element: <Ai />,
        meta: {
          roles: ["admin"],
          title: "Ai",
          key: "Ai",
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
