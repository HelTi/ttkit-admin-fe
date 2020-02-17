import React from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { fetchUploadList } from '@/services/websit'
import { Card, Table } from 'antd'
import ApiUrl from '@/services/api-url'
import { formatDate } from '@/utils/utils';


const columns = [
  {
    title: '文件名',
    dataIndex: 'name',
  },
  {
    title: '预览',
    render: (text, record) => (
      <div>
        <img alt="" style={{ width: 50 }} src={`${ApiUrl.ManApiUrl}${record.filePath.replace('public', '')}`}/>
      </div>
    ),
  },
  {
    title: '文件路径',
    render: (text, record) => (
      <span>
        {`${ApiUrl.ManApiUrl}${record.filePath.replace('public', '')}`}
      </span>
    ),
  },
  {
    title: '文件大小',
    dataIndex: 'size',
  },
  {
    title: '上传时间',
    dataIndex: 'upload_date',
    render: text => <span>{formatDate(text)}</span>,
  },
]

class WebsitPhoto extends React.PureComponent {
  state = {
    fileList: [],
    loading: true,
    paginationConfig: {
      current: 1,
      pageSize: 10,
      total: 100,
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
    fetchUploadList(parmas).then(res => {
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
