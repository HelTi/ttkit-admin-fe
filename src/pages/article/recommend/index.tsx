import { Button, Card, Modal, message } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import { PageContainer, ProTable, type ProColumns } from '@ant-design/pro-components';
import { useState, useEffect, useCallback } from 'react';
import {
  fetchAddRecommendArticel,
  fetchDeleteRecommendArticel,
  fetchRecommendArticles,
  queryArticleList,
  type Article,
} from '@/services/article';

const { confirm } = Modal;

interface RecommendArticleRecord extends Article {
  uuid: string;
  title: string;
}

const RecommendArticle: React.FC = () => {
  const [tableData, setTableData] = useState<RecommendArticleRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedArticles, setSelectedArticles] = useState<React.Key[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(true);

  const [paginationConfig, setPaginationConfig] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total: number) => (
      <>
        <p>共{total}条数据</p>
      </>
    ),
  });

  const getArticleHandle = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetchRecommendArticles();
      if (Array.isArray(res?.data)) {
        setTableData(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch recommend articles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getArticleHandle();
  }, [getArticleHandle]);

  // 删除推荐文章
  const handleDelete = useCallback((record: RecommendArticleRecord): void => {
    confirm({
      title: '确认删除',
      content: '确定要删除这篇推荐文章吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await fetchDeleteRecommendArticel(record.uuid);
          message.success('删除成功');
          getArticleHandle();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  }, [getArticleHandle]);

  // 表格列配置
  const columns: ProColumns<RecommendArticleRecord>[] = [
    {
      title: '文章标题',
      dataIndex: 'title',
    },
    {
      title: 'UUID',
      dataIndex: 'uuid',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" danger onClick={() => handleDelete(record)}>
          删除
        </Button>
      ),
    },
  ];

  // 打开添加文章弹窗
  const showAddModal = (): void => {
    setVisible(true);
  };

  // 提交选中的文章
  const handleSubmit = async (): Promise<void> => {
    try {
      const uuids = selectedArticles.map((key) => String(key));
      await fetchAddRecommendArticel(uuids);
      message.success('添加推荐文章成功');
      setVisible(false);
      setSelectedArticles([]);
      getArticleHandle();
    } catch (error) {
      message.error('添加推荐文章失败');
    }
  };

  // 在 useEffect 中初始加载
  useEffect(() => {
    const getArticle = async (): Promise<void> => {
      setTableLoading(true);
      try {
        const params = {
          pageNo: paginationConfig.current || 1,
          pageSize: paginationConfig.pageSize || 10,
        };
        const res = await queryArticleList(params);
        const { data } = res;
        if (data && Array.isArray(data.data)) {
          setArticleList(data.data);
          setTotal(data.count || 0);
        }
      } catch (error) {
        console.error('Failed to fetch article list:', error);
      } finally {
        setTableLoading(false);
      }
    };
    getArticle();
  }, [visible, paginationConfig]);

  const handleTableChange = (pagination: TablePaginationConfig): void => {
    setPaginationConfig({
      ...paginationConfig,
      ...pagination,
    });
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '文章推荐',
      }}
    >
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={showAddModal}>
            添加推荐文章
          </Button>
        </div>

        <ProTable<RecommendArticleRecord>
          rowKey="uuid"
          columns={columns}
          dataSource={tableData}
          loading={loading}
          search={false}
          options={false}
          pagination={false}
        />

        <Modal
          title="选择推荐文章"
          open={visible}
          onOk={handleSubmit}
          onCancel={() => {
            setVisible(false);
            setSelectedArticles([]);
          }}
          width={800}
        >
          <ProTable<Article>
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys) => {
                // 限制最多选择3条
                if (selectedRowKeys.length <= 3) {
                  setSelectedArticles(selectedRowKeys);
                } else {
                  message.warning('最多只能选择3条数据');
                }
              },
              selectedRowKeys: selectedArticles,
              getCheckboxProps: (record) => ({
                disabled: selectedArticles.length >= 3 && !selectedArticles.includes(record.uuid),
              }),
            }}
            dataSource={articleList}
            rowKey="uuid"
            columns={[
              {
                title: '文章标题',
                dataIndex: 'title',
                key: 'title',
              },
            ]}
            onChange={(pagination) => handleTableChange(pagination)}
            pagination={{ ...paginationConfig, total }}
            loading={tableLoading}
            search={false}
            options={false}
          />
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default RecommendArticle;