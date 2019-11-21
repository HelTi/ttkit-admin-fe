import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { queryCurrent } from '@/services/user';
import { queryArticleList } from '@/services/article';
import { Table, Tag, Button, Card } from 'antd';

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
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
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
  };

  getArticleList = () => {
    this.setState({
      loading: true,
    });
    let queryParams = {
      pageSize: this.state.pageSize,
      page: this.state.currentPage,
    };
    queryArticleList(queryParams).then(({ data }) => {
      this.setState({
        articles: data.data,
        loading: false,
      });
    });
  };

  componentDidMount() {
    this.getArticleList();
  }
  render() {
    const articles = this.state.articles;
    return (
      <Card bordered={false}>
        <Table rowKey={record => record.uuid} columns={columns} dataSource={articles}></Table>
      </Card>
    );
  }
}

export default ArticleList;
