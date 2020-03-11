import React from 'react';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { queryArticleList, deleteArticle } from '@/services/article';
import { Table, Tag, Button, Card, Modal, message } from 'antd';
import { formatDate } from '@/utils/utils';
import ApiUrl from '@/services/api-url';
import styles from './style.less';

const { confirm } = Modal;

class ArticleList extends React.Component {
  state = {
    articles: [],
    loading: true,
    paginationConfig: {
      current: 1,
      pageSize: 10,
      total: 100,
      showSizeChanger: true,
      showTotal: total => (
        <>
          <p>共{total}条数据</p>
        </>
      ),
    },
    columns: [
      {
        title: '文章标题',
        dataIndex: 'title',
        width: 200,
        ellipsis: true,
        render: (text, record) => (
          <>
            <a
              href={`${ApiUrl.StaticUrl}/article/${record.uuid}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {text}
            </a>
          </>
        ),
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
        width: 150,
        render: (text, record) => (
          <div>
            <Button
              onClick={() => this.goEditArticle(record.uuid)}
              type="dashed"
              size="small"
              style={{ marginRight: '8px' }}
            >
              编辑
            </Button>
            <Button
              onClick={() => this.deleteArticleHandle(record.uuid)}
              type="danger"
              size="small"
            >
              删除
            </Button>
          </div>
        ),
      },
    ],
  };

  componentDidMount() {
    this.getArticleList();
  }

  getArticleList = () => {
    this.setState({
      loading: true,
    });
    const { paginationConfig } = this.state;
    const parmas = {
      page: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    };
    queryArticleList(parmas).then(({ data }) => {
      paginationConfig.total = data.count;
      this.setState({
        articles: data.data,
        loading: false,
        paginationConfig,
      });
    });
  };

  onChangeHandle = pagination => {
    const { paginationConfig } = this.state;
    paginationConfig.pageSize = pagination.pageSize;
    paginationConfig.current = pagination.current;
    if (this.state.paginationConfig.pageSize !== pagination.pageSize) {
      paginationConfig.current = 1;
    }
    this.setState({
      paginationConfig,
    });
    this.getArticleList();
  };

  addArticelHandle = () => {
    router.push('/article/add');
  };

  goEditArticle = uuid => {
    router.push({
      pathname: '/article/add',
      query: {
        uuid,
      },
    });
  };

  deleteArticleHandle = uuid => {
    const that = this;
    confirm({
      title: '警告！',
      content: '确定要删除此文章吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteArticle(uuid).then(res => {
          if (res.code === 200) {
            message.success('删除成功！');
            that.getArticleList();
          } else {
            message.error('删除失败');
          }
        });
      },
      onCancel() {},
    });
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
                columns={this.state.columns}
                onChange={this.onChangeHandle}
                dataSource={articles}
                pagination={this.state.paginationConfig}
                loading={this.state.loading}
              ></Table>
            </div>
          </Card>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default ArticleList;
