import { useCallback, useEffect, useState } from 'react';
import { queryCategoryMenus, queryMenuCategory } from '@/services/menu';
import type { TreeNode } from '@/utils/utils';
import type { MenuItem } from '../types';

export const useMenuData = () => {
  const [menuCategory, setMenuCategory] = useState<TreeNode[]>([]);
  const [categoryMenus, setCategoryMenus] = useState<MenuItem[]>([]);
  const [selectCategory, setSelectCategory] = useState<string | null>(null);
  const [selectMenuCodes, setSelectMenuCodes] = useState<string[]>([]);
  const [currentTreeNode, setCurrentTreeNode] = useState<TreeNode | null>(null);

  // 获取类目树
  const getMenuCategory = useCallback(async () => {
    const res = await queryMenuCategory();
    const { data } = res;
    setMenuCategory(data);
  }, []);

  // 获取类目下的菜单数据
  const getMenuCategoryMenus = useCallback(async (parentMenuCodes: string[] = []) => {
    const res = await queryCategoryMenus(parentMenuCodes as any);
    const { data } = res;
    setCategoryMenus(data);
  }, []);

  // 初始化加载菜单类目
  useEffect(() => {
    queryMenuCategory().then((res) => {
      const { code, data } = res;
      if (code === 200) {
        setMenuCategory(data);
      }
    });
  }, []);

  // 当选择的菜单编码变化时，重新加载菜单数据
  useEffect(() => {
    getMenuCategoryMenus(selectMenuCodes);
  }, [selectMenuCodes, getMenuCategoryMenus]);

  return {
    menuCategory,
    categoryMenus,
    selectCategory,
    selectMenuCodes,
    currentTreeNode,
    setMenuCategory,
    setCategoryMenus,
    setSelectCategory,
    setSelectMenuCodes,
    setCurrentTreeNode,
    getMenuCategory,
    getMenuCategoryMenus,
  };
};
