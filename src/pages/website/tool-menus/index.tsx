import React, { useCallback, useState } from 'react';
import { Card, Col, Row } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import type { DataNode } from 'antd/es/tree';
import { findArrayChildrenData } from '@/utils/utils';
import JsonReaderModal from '@/components/json-reader-modal';
import { useMenuData } from './hooks/useMenuData';
import { useMenuActions } from './hooks/useMenuActions';
import MenuTree from './components/MenuTree';
import MenuTable from './components/MenuTable';
import MenuFormModal from './components/MenuFormModal';
import { importJsonData } from './utils/jsonImport';
import type { FormValues, MenuItem } from './types';

const ToolMenus: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<MenuItem | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const {
    menuCategory,
    categoryMenus,
    selectCategory,
    selectMenuCodes,
    currentTreeNode,
    setSelectCategory,
    setSelectMenuCodes,
    setCurrentTreeNode,
    getMenuCategory,
    getMenuCategoryMenus,
  } = useMenuData();

  const {
    handleDelete,
    confirmDeleteMenuCategory,
    handleSave,
    fetchWebsiteInfo,
    validateAddWebsite,
    validateAddCategory,
  } = useMenuActions({
    selectMenuCodes,
    getMenuCategory,
    getMenuCategoryMenus,
    currentTreeNode,
  });

  // 树节点选择处理
  const onSelect = useCallback(
    (
      selectedKeys: React.Key[],
      info: {
        node: DataNode;
        selected: boolean;
      },
    ) => {
      const { node, selected } = info;
      const treeNode = node as unknown as any;
      const codes = findArrayChildrenData([treeNode]);

      setSelectMenuCodes(codes);

      if (selected) {
        setSelectCategory(selectedKeys[0] as string);
        setCurrentTreeNode(treeNode);
      } else {
        setSelectCategory(null);
        setCurrentTreeNode(null);
      }
    },
    [setSelectCategory, setSelectMenuCodes, setCurrentTreeNode],
  );

  // 添加网址
  const handleAddWebsite = useCallback(() => {
    const submitParentMenuCode = validateAddWebsite();
    if (!submitParentMenuCode) return;

    setEditingRecord(null);
    setImageUrl('');
    setVisible(true);
  }, [validateAddWebsite]);

  // 添加菜单类目
  const handleAddCategory = useCallback(() => {
    const submitParentMenuCode = validateAddCategory();
    if (submitParentMenuCode === null) return;

    setEditingRecord({
      isMenuCategory: true,
      submitParentMenuCode,
    } as MenuItem);
    setImageUrl('');
    setVisible(true);
  }, [validateAddCategory]);

  // 编辑菜单
  const handleEditMenu = useCallback(
    (record: MenuItem) => {
      setEditingRecord(record);
      setImageUrl(record?.menuIcon || '');
      setVisible(true);
    },
    [],
  );

  // 编辑类目
  const handleEditCategory = useCallback(() => {
    if (!currentTreeNode) return;

    const obj = {
      ...currentTreeNode,
      submitParentMenuCode: [...(currentTreeNode?.submitParentMenuCode || [])],
    } as MenuItem;

    handleEditMenu(obj);
  }, [currentTreeNode, handleEditMenu]);

  // 保存菜单
  const handleSaveMenu = useCallback(
    async (values: FormValues) => {
      // 如果是编辑模式，合并编辑的记录
      const finalValues = editingRecord
        ? { ...editingRecord, ...values }
        : values;

      // 如果是添加网址，设置父级菜单编码
      if (!editingRecord && !finalValues.isMenuCategory) {
        const submitParentMenuCode = validateAddWebsite();
        if (submitParentMenuCode) {
          finalValues.submitParentMenuCode = submitParentMenuCode;
        }
      }

      const success = await handleSave(finalValues);
      if (success) {
        setEditingRecord(null);
        setImageUrl('');
      }
      return success;
    },
    [editingRecord, handleSave, validateAddWebsite],
  );

  // 关闭弹窗
  const handleCloseModal = useCallback(() => {
    setVisible(false);
    setEditingRecord(null);
    setImageUrl('');
  }, []);

  return (
    <PageContainer
      ghost
      header={{
        title: '工具集菜单管理',
      }}
    >
      <Card
        title={'工具集菜单管理'}
        extra={
          <JsonReaderModal
            success={(parsed) => {
              importJsonData(parsed).then(() => {
                getMenuCategory();
              });
            }}
          />
        }
      >
        <Row>
          <Col span={4} style={{ borderRight: '1px solid #dedede' }}>
            <MenuTree
              menuCategory={menuCategory}
              selectCategory={selectCategory}
              onSelect={onSelect}
              onDelete={confirmDeleteMenuCategory}
              onEdit={handleEditCategory}
              onAdd={handleAddCategory}
            />
          </Col>
          <Col span={20}>
            <div style={{ paddingLeft: '10px' }}>
              <MenuTable
                dataSource={categoryMenus}
                onAdd={handleAddWebsite}
                onDelete={handleDelete}
                onEdit={handleEditMenu}
              />
            </div>
          </Col>
        </Row>
      </Card>

      <MenuFormModal
        visible={visible}
        menuCategory={menuCategory}
        initialValues={editingRecord || undefined}
        imageUrl={imageUrl}
        onSave={handleSaveMenu}
        onCancel={handleCloseModal}
        onFetchWebsiteInfo={fetchWebsiteInfo}
      />
    </PageContainer>
  );
};

export default ToolMenus;
