import { Button, Popconfirm } from 'antd';
import type { TableColumnsType } from 'antd';
import type { MenuItem } from '../types';

interface CreateColumnsProps {
  onDelete: (record: MenuItem) => void;
  onEdit: (record: MenuItem) => void;
}

export const createColumns = ({
  onDelete,
  onEdit,
}: CreateColumnsProps): TableColumnsType<MenuItem> => [
  {
    title: '排序大小',
    dataIndex: 'sort_num',
    key: 'sort_num',
    ellipsis: true,
  },
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    key: 'menuName',
    ellipsis: true,
  },
  {
    title: '备注',
    dataIndex: 'desc',
    key: 'desc',
    ellipsis: true,
  },
  {
    title: '菜单编码',
    dataIndex: 'menuCode',
    key: 'menuCode',
  },
  {
    title: '上级菜单编码',
    dataIndex: 'parentMenuCode',
    key: 'parentMenuCode',
  },
  {
    title: '菜单图标',
    dataIndex: 'menuIcon',
    key: 'menuIcon',
    render: (text: string) => {
      return (
        <div style={{ display: 'flex', maxWidth: 200, overflow: 'auto' }}>
          <img
            style={{ marginRight: 8 }}
            width="60px"
            height="60px"
            alt={text}
            src={text}
          />
          <p>{text}</p>
        </div>
      );
    },
  },
  {
    title: '菜单URL',
    dataIndex: 'menuUrl',
    key: 'menuUrl',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 180,
    render: (_: any, record: MenuItem) => {
      return (
        <>
          <Popconfirm
            title="确认删除"
            description={`确定要删除菜单"${record.menuName || record.menuCode}"吗？此操作不可恢复。`}
            onConfirm={() => onDelete(record)}
            okText="确定"
            cancelText="取消"
            okType="danger"
          >
            <Button danger>删除</Button>
          </Popconfirm>
          <Button type="link" onClick={() => onEdit(record)}>
            编辑
          </Button>
        </>
      );
    },
  },
];
