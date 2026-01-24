// 运行时配置

import {
  BarChartOutlined,
  CodeOutlined,
  FileTextOutlined,
  FolderOutlined,
  GlobalOutlined,
  HistoryOutlined,
  HomeOutlined,
  StarOutlined,
  TagsOutlined,
  ThunderboltOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import type { MenuDataItem } from '@ant-design/pro-components';
import { Link, RuntimeConfig } from '@umijs/max';
import React from 'react';
import { queryCurrentUserInfo } from './services/user';
import AvatarDropdown from './components/AvatarDropdown';

/** 菜单 icon 名称（.umirc.ts 的 icon 字段）到组件的映射，与路由配置保持一致 */
const MENU_ICON_MAP: Record<string, React.ComponentType> = {
  HomeOutlined,
  FileTextOutlined,
  UnorderedListOutlined,
  TagsOutlined,
  StarOutlined,
  GlobalOutlined,
  FolderOutlined,
  HistoryOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  CodeOutlined,
};

function getMenuIcon(iconName: string): React.ReactNode {
  const Icon = MENU_ICON_MAP[iconName];
  return Icon ? <Icon /> : null;
}

type InitialState = {
  name: string;
  avatar?: string;
};

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<InitialState> {
  const { data } = await queryCurrentUserInfo();
  const name = data?.name ?? '';
  const avatar_url = data?.avatar_url;

  return { name, avatar: avatar_url };
}

export const layout = (props: RuntimeConfig) => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    title: 'ttkit管理平台',
    pure: false,
    fixSiderbar: true,
    layout: 'mix',
    splitMenus: false,
    menu: {
      locale: false,
    },
    // Pro Layout 默认只在 level 0 显示图标，通过 menuItemRender 为二级子菜单补充图标
    menuItemRender: (menuItemProps: MenuDataItem & { isUrl?: boolean; itemPath?: string }, defaultDom: React.ReactNode, menuProps?: { location?: { pathname?: string }; baseClassName?: string; hashId?: string }) => {
      let dom = defaultDom;
      const isLeaf = !menuItemProps.children && !menuItemProps.routes;
      // icon 可能是字符串（.umirc）或已被 Umi patchRoutes 转为 React 元素
      let iconEl: React.ReactNode = null;
      if (isLeaf && menuItemProps.icon !== undefined && menuItemProps.icon !== null) {
        if (typeof menuItemProps.icon === 'string') {
          iconEl = getMenuIcon(menuItemProps.icon);
        } else if (React.isValidElement(menuItemProps.icon)) {
          iconEl = menuItemProps.icon;
        }
      }
      if (iconEl) {
        const cn = menuProps?.baseClassName ?? 'ant-pro-base-menu-inline';
        const h = menuProps?.hashId ?? '';
        dom = (
          <div className={`${cn}-item-title ${h}`.trim()}>
            <span className={`${cn}-item-icon ${h}`.trim()}>{iconEl}</span>
            <span className={`${cn}-item-text ${h}`.trim()}>{menuItemProps.name}</span>
          </div>
        );
      }
      if (menuItemProps.isUrl || menuItemProps.children) return dom;
      const path = menuItemProps.path ?? menuItemProps.itemPath;
      const pathname = menuProps?.location?.pathname;
      if (path && pathname !== path) {
        return <Link to={String(path).replace('/*', '')} target={menuItemProps.target}>{dom}</Link>;
      }
      return dom;
    },
    avatarProps: {
      src: props.initialState?.avatar,
      title: props.initialState?.name,
      render: (props: InitialState, dom: React.ReactNode) => {
        return <AvatarDropdown dom={dom} />;
      },
    }
  };
};
