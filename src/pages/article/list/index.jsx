import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { queryCurrent } from '@/services/user';
import { queryArticleList } from '@/services/article';
import { Table, Tag, Button, Card } from 'antd';
import { formatDate } from '@/utils/utils';

const columns = [
  {
    title: '文章标题',
    dataIndex: 'title',
  },
  {
    title: '作者',
    dataIndex: 'author',
  },
  {
    title: '标签',
    key: 'tags',
    render: (text, record) => (
      <span>
        {record.tags.map(tag => (
          <Tag>{tag.name}</Tag>
        ))}
      </span>
    ),
  },
  {
    title: '阅读量',
    dataIndex: 'meta',
    render: text => <span>{text.views}</span>,
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    render: text => <span>{formatDate(text)}</span>,
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    render: text => <span>{formatDate(text)}</span>,
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <div>
        <Button type="primary" size="small">
          查看
        </Button>
        <Button type="dashed" size="small">
          编辑
        </Button>
        <Button type="danger" size="small">
          删除
        </Button>
      </div>
    ),
  },
];

class ArticleList extends React.Component {
  state = {
    articles: [],
    updateTitle: '',
    newTitle: '',
    currentPage: 1,
    articleTotal: 0,
    pageSize: 10,
    loading: true,
    paginationConfig: {
      current: 1,
      pageSize: 10,
      total: 100,
      showSizeChanger: true,
    },
  };

  getArticleList = () => {
    this.setState({
      loading: true,
    });
    let queryParams = {
      pageSize: this.state.paginationConfig.pageSize,
      page: this.state.paginationConfig.current,
    };
    queryArticleList(queryParams).then(({ data }) => {
      this.setState({
        articles: data.data,
        loading: false,
        paginationConfig: Object.assign(this.state.paginationConfig, { total: data.count }),
      });
    });
  };

  onChangeHandle = pagination => {
    this.setState({
      paginationConfig: Object.assign(this.state.paginationConfig, {
        current: pagination.current,
      }),
    });
    if (this.state.paginationConfig.pageSize !== pagination.pageSize) {
      this.setState({
        paginationConfig: Object.assign(this.state.paginationConfig, {
          current: 1,
          pageSize: pagination.pageSize,
        }),
      });
    }
    this.getArticleList();
  };

  componentDidMount() {
    this.getArticleList();
  }
  render() {
    const articles = this.state.articles;
    return (
      <Card bordered={false}>
        <Table
          rowKey={record => record.uuid}
          columns={columns}
          onChange={this.onChangeHandle}
          dataSource={articles}
          pagination={this.state.paginationConfig}
        ></Table>
      </Card>
    );
  }
}

export default ArticleList;
