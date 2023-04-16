
import { fetchVisitorList } from "@/services/websit";
import { formatDate } from "@/utils/utils";
import { Card, Table } from "antd";
import { useEffect, useState } from "react";
import parser from 'ua-parser-js';


const formatBrowserAgent = agent => {
  if (agent) {
    const ua = parser(agent);
    return `${ua.browser.name}-${ua.browser.major}  ${ua.os.name}`;
  }
    return '未知';
}

export default function Visitor() {
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [paginationConfig, setPaginationConfig] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => (
      <>
        <p>共{total}条数据</p>
      </>
    ),
  });

  const columns = [
    {
      title: '用户IP',
      dataIndex: 'ip',
    },
    {
      title: '用户区域',
      dataIndex: 'address',
    },
    {
      title: '访问时间',
      dataIndex: 'browse_time',
      render: text => (
        <span>
          {formatDate(text)}
        </span>
      ),
    },
    {
      title: '系统信息',
      dataIndex: 'user_agent',
      render: text => <span>{formatBrowserAgent(text)}</span>,
    },
  ]

  useEffect(() => {
    getTableHandle(paginationConfig);
  }, [paginationConfig]);

  const getTableHandle = async (p) => {
    setTableLoading(true);
    const params = {
      pageNo: p.current,
      pageSize: p.pageSize,
    };
    const res = await fetchVisitorList(params);
    setTableLoading(false);
    const { data } = res;
    if (Array.isArray(data.data)) {
      setTableData(data.data);
      setTotal(data?.count || 0);
    }
  };

  const handleTableChange = (pagination) => {
    setPaginationConfig({
      ...paginationConfig,
      ...pagination,
    });
  };


  return (
    <Card>
      <Table
        rowKey={(record) => record._id}
        dataSource={tableData}
        columns={columns}
        pagination={{ ...paginationConfig, total }}
        loading={tableLoading}
        onChange={handleTableChange}
      ></Table>
    </Card>
  );
}
