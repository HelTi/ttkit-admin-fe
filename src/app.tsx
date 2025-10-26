import React from 'react';
import type { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import './index.css';
import './styles/app.scss';

export function rootContainer(container: ReactNode) {
  return <ConfigProvider locale={zhCN}>{container}</ConfigProvider>;
}
