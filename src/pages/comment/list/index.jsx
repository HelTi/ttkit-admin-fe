import React from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { fetchCommentList, deleteCommentById } from '@/services/websit'
import { Card, Table, Button, Modal, message } from 'antd'
import parser from 'ua-parser-js';
import { formatDate } from '@/utils/utils';

const { confirm } = Modal;

const formatBrowserAgent = agent => {
  if (agent) {
    const ua = parser(agent);
    return `${ua.browser.name}-${ua.browser.major}  ${ua.os.name}`;
  }
    return '未知';
}

class Comment extends React.PureComponent {
  state={
    tableData: [],
    loading: true,
    paginationConfig: {
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
    },
    columns: [
      {
        title: '文章id',
        dataIndex: 'article',
      },
      {
        title: '用户名',
        dataIndex: 'nickName',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '内容',
        dataIndex: 'content',
      },
      {
        title: '用户IP',
        dataIndex: 'userIp',
      },
      {
        title: '用户区域',
        dataIndex: 'address',
      },
      {
        title: '评论时间',
        dataIndex: 'create_time',
        render: text => (
          <span>
            {formatDate(text)}
          </span>
        ),
      },
      {
        title: '系统信息',
        dataIndex: 'userAgent',
        render: text => <span>{formatBrowserAgent(text)}</span>,
      },
      {
        title: '操作',
        fixed: 'right',
        width: 80,
        render: (text, record) => <Button onClick={() => this.delteComment(record._id)} type="danger" size="small">删除</Button>,
      },
    ],

  }

  componentDidMount() {
    this.getCommentList()
  }

  getCommentList = () => {
    this.setState({
      loading: true,
    })
    const { paginationConfig } = this.state
    const parmas = {
      page: paginationConfig.current, pageSize: paginationConfig.pageSize,
    }
    fetchCommentList(parmas).then(res => {
      if (res.code === 200) {
        const { data } = res
        paginationConfig.total = data.count
        this.setState({
          tableData: data.data,
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
    this.getCommentList();
  }

  delteComment = id => {
    const that = this
    confirm({
      title: '警告！',
      content: '确定要删除此评论吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteCommentById(id).then(res => {
          if (res.code === 200) {
            message.success('删除成功！')
            that.getCommentList()
          } else {
            message.error('删除失败')
          }
        })
      },
      onCancel() {

      },
    });
  }

  render() {
    const { tableData } = this.state
    return (
      <PageHeaderWrapper>
          <Card bordered={false}>
          <div className="tableContent">
          <Table
                rowKey={record => record._id}
                columns={this.state.columns}
                onChange={this.onChangeHandle}
                dataSource={tableData}
                pagination={this.state.paginationConfig}
                loading={this.state.loading}
                scroll={{ x: 1100 }}
              ></Table>
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }
}


export default Comment
