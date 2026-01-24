import React from 'react';
import { Button, Table } from 'antd';
import { createColumns } from '../../utils/columns';
import type { MenuItem } from '../../types';

interface MenuTableProps {
  dataSource: MenuItem[];
  onAdd: () => void;
  onDelete: (record: MenuItem) => void;
  onEdit: (record: MenuItem) => void;
}

const MenuTable: React.FC<MenuTableProps> = ({
  dataSource,
  onAdd,
  onDelete,
  onEdit,
}) => {
  const columns = createColumns({ onDelete, onEdit });

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={onAdd}>添加网址</Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(record) => record._id || record.menuCode || ''}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default MenuTable;
