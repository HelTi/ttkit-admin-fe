import React from 'react';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { queryArticleList } from '@/services/article';
import { Table, Tag, Button, Card } from 'antd';
import { formatDate } from '@/utils/utils';
import styles from './style.less';

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
          <Tag key={tag._id}>{tag.name}</Tag>
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

  componentDidMount() {
    this.getArticleList();
  }

  getArticleList = () => {
    this.state.loading = true
    const queryParams = {
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

  addArticelHandle = () => {
    router.push('/article/add');
  };


  render() {
    const { articles } = this.state;
    return (
      <>
        <PageHeaderWrapper>
          <Card bordered={false}>
            <div className="search-form">
              <Button onClick={this.addArticelHandle} type="primary">
                新增
              </Button>
            </div>
            <div className={styles.adminTable}>
              <Table
                rowKey={record => record.uuid}
                columns={columns}
                onChange={this.onChangeHandle}
                dataSource={articles}
                pagination={this.state.paginationConfig}
              ></Table>
            </div>
          </Card>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default ArticleList;
