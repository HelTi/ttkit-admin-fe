import { useCallback } from 'react';
import { message } from 'antd';
import {
  queryCreateMenu,
  queryDeleteMenu,
  queryUpdateMenu,
  fetchWebsiteFaviconInfo,
} from '@/services/menu';
import ApiUrl from '@/config/api-url';
import type { MenuItem, FormValues } from '../types';
import type { TreeNode } from '@/utils/utils';

interface UseMenuActionsProps {
  selectMenuCodes: string[];
  getMenuCategory: () => Promise<void>;
  getMenuCategoryMenus: (codes: string[]) => Promise<void>;
  currentTreeNode: TreeNode | null;
}

export const useMenuActions = ({
  selectMenuCodes,
  getMenuCategory,
  getMenuCategoryMenus,
  currentTreeNode,
}: UseMenuActionsProps) => {
  // 删除菜单项
  const handleDelete = useCallback(
    async (row: MenuItem) => {
      const { menuCode } = row;
      if (!menuCode) return;
      const res = await queryDeleteMenu([menuCode] as any);
      if (res.code === 200) {
        message.info('删除成功！');
        await getMenuCategoryMenus(selectMenuCodes);
      }
    },
    [selectMenuCodes, getMenuCategoryMenus],
  );

  // 删除菜单类目
  const confirmDeleteMenuCategory = useCallback(async () => {
    const res = await queryDeleteMenu(selectMenuCodes as any);
    if (res.code === 200) {
      message.success('删除成功！');
      await getMenuCategory();
    }
  }, [selectMenuCodes, getMenuCategory]);

  // 保存菜单（新增或更新）
  const handleSave = useCallback(
    async (values: FormValues) => {
      const params: any = {
        ...values,
      };
      const length = params?.submitParentMenuCode?.length;
      if (length) {
        params.parentMenuCode = params.submitParentMenuCode[length - 1];
      }

      // 如果不是类目，且没有选择父级类目拒绝保存
      if (!params.isMenuCategory && !params.parentMenuCode) {
        message.error('该菜单不是菜单类目,请选择上级菜单编码！');
        return false;
      }

      try {
        if (params.menuCode) {
          // 更新
          await queryUpdateMenu(params.menuCode, params);
        } else {
          // 新增
          await queryCreateMenu(params);
        }

        // 刷新数据
        if (params.isMenuCategory) {
          await getMenuCategory();
        } else {
          await getMenuCategoryMenus(selectMenuCodes);
        }

        return true;
      } catch (error) {
        message.error('保存失败，请稍后重试');
        return false;
      }
    },
    [selectMenuCodes, getMenuCategory, getMenuCategoryMenus],
  );

  // 获取网站信息
  const fetchWebsiteInfo = useCallback(async (menuUrl: string) => {
    if (!menuUrl) {
      message.warning('请先输入网址');
      return null;
    }

    try {
      const res = await fetchWebsiteFaviconInfo(menuUrl);
      const { data } = res;
      const { faviconUrl, description } = data;

      const result: { iconUrl?: string; description?: string } = {};

      if (faviconUrl) {
        result.iconUrl = ApiUrl.ManApiUrl + '/' + faviconUrl;
      }

      if (description) {
        result.description = description;
      }

      return result;
    } catch (error) {
      message.error('获取网站信息失败');
      return null;
    }
  }, []);

  // 添加网址前的验证
  const validateAddWebsite = useCallback(() => {
    if (!currentTreeNode?.menuCode) {
      message.error('请先选择类目！');
      return null;
    }

    const submitParentMenuCode = [
      ...(currentTreeNode?.submitParentMenuCode || []),
      currentTreeNode?.key || currentTreeNode?.menuCode || '',
    ];

    return submitParentMenuCode;
  }, [currentTreeNode]);

  // 添加类目前的验证
  const validateAddCategory = useCallback(() => {
    if ((currentTreeNode?.submitParentMenuCode?.length || 0) > 0) {
      message.warning('最多添加二级类目！');
      return null;
    }

    if (currentTreeNode?.menuCode) {
      const submitParentMenuCode = [
        ...(currentTreeNode?.submitParentMenuCode || []),
        currentTreeNode?.key || currentTreeNode?.menuCode || '',
      ];
      return submitParentMenuCode;
    }

    return [];
  }, [currentTreeNode]);

  return {
    handleDelete,
    confirmDeleteMenuCategory,
    handleSave,
    fetchWebsiteInfo,
    validateAddWebsite,
    validateAddCategory,
  };
};
