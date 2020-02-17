import React from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { fetchVisitorList } from '@/services/websit'
import { Card, Table } from 'antd'
import parser from 'ua-parser-js';
import { formatDate } from '@/utils/utils';


const formatBrowserAgent = agent => {
  if (agent) {
    const ua = parser(agent);
    return `${ua.browser.name}-${ua.browser.major}  ${ua.os.name}`;
  }
    return '未知';
}

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

class WebsitPhoto extends React.PureComponent {
  state = {
    fileList: [],
    loading: true,
    paginationConfig: {
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
    },
  }

  componentDidMount() {
    this.getUploadList()
  }

  getUploadList = () => {
    this.setState({
      loading: true,
    })
    const { paginationConfig } = this.state
    const parmas = {
      page: paginationConfig.current, pageSize: paginationConfig.pageSize,
    }
    fetchVisitorList(parmas).then(res => {
      if (res.code === 200) {
        const { data } = res
        paginationConfig.total = data.count
        this.setState({
          fileList: data.data,
          loading: false,
          paginationConfig,
        })
      }
    })
  }

  onChangeHandle = pagination => {
    const { paginationConfig } = this.state
    paginationConfig.pageSize = pagination.pageSize
    paginationConfig.current = pagination.current
    if (this.state.paginationConfig.pageSize !== pagination.pageSize) {
      paginationConfig.current = 1
    }
    this.setState({
      paginationConfig,
    })
    this.getUploadList();
  };

  render() {
    const { fileList } = this.state
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableContent">
          <Table
                rowKey={record => record._id}
                columns={columns}
                onChange={this.onChangeHandle}
                dataSource={fileList}
                pagination={this.state.paginationConfig}
                loading={this.state.loading}
              ></Table>
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }
}


export default WebsitPhoto
