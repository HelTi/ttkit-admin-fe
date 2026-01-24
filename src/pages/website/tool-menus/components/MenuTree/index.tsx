import React from 'react';
import { Button, Popconfirm, Tooltip, Tree } from 'antd';
import {
  CloseOutlined,
  DownOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import type { DataNode } from 'antd/es/tree';
import type { TreeNode } from '@/utils/utils';

interface MenuTreeProps {
  menuCategory: TreeNode[];
  selectCategory: string | null;
  onSelect: (
    selectedKeys: React.Key[],
    info: {
      node: DataNode;
      selected: boolean;
    },
  ) => void;
  onDelete: () => void;
  onEdit: () => void;
  onAdd: () => void;
}

const MenuTree: React.FC<MenuTreeProps> = ({
  menuCategory,
  selectCategory,
  onSelect,
  onDelete,
  onEdit,
  onAdd,
}) => {
  const cancel = () => {
    message.info('已取消');
  };

  return (
    <div>
      <div style={{ marginBottom: '15px' }}>
        <Popconfirm
          title="提示"
          description="确认删除此菜单吗?"
          onConfirm={onDelete}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
          disabled={!selectCategory}
        >
          <Button
            danger
            type="dashed"
            size="small"
            icon={<CloseOutlined />}
            disabled={!selectCategory}
          ></Button>
        </Popconfirm>
        <Button
          onClick={onEdit}
          style={{ marginLeft: 10 }}
          icon={<EditOutlined />}
          type="dashed"
          size="small"
          disabled={!selectCategory}
        ></Button>
        <Tooltip placement="top" title={'新增类目'}>
          <Button
            onClick={onAdd}
            style={{ marginLeft: 10 }}
            icon={<PlusOutlined />}
            type="dashed"
            size="small"
          ></Button>
        </Tooltip>
      </div>
      <Tree
        showIcon
        showLine
        defaultExpandAll
        switcherIcon={<DownOutlined />}
        treeData={menuCategory as DataNode[]}
        onSelect={onSelect}
        fieldNames={{
          title: 'menuName',
          key: 'menuCode',
        }}
      />
    </div>
  );
};

export default MenuTree;
