import { Button, Card, Table, Modal, message } from 'antd';
import { useState, useEffect } from 'react';
import { fetchAddRecommendArticel, fetchDeleteRecommendArticel, fetchRecommendArticles, queryArticleList } from '@/services/article';

const { confirm } = Modal;

const RecommendArticle = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [total, setTotal] = useState(0); // 新增总数状态;

  const [articleList, setArtilceList] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

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

  // 表格列配置
  const columns = [
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

   useEffect(()=>{
    async function getData(){
      const res = await fetchRecommendArticles()
      console.log('res---',res)
      setLoading(false)
      setTableData(res?.data || [])
    }
    getData()
   },[])

   const getArticleHandle = async ()=>{
    setLoading(true);
    const res = await fetchRecommendArticles();
    setLoading(false);
    if (Array.isArray(res?.data)) {
      setTableData(res?.data || [])
    }
  }


  // 删除推荐文章
  const handleDelete = (record) => {
    confirm({
      title: '确认删除',
      content: '确定要删除这篇推荐文章吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await fetchDeleteRecommendArticel(record.uuid)
          message.success('删除成功');
          getArticleHandle()
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 打开添加文章弹窗
  const showAddModal = () => {
    setVisible(true);
  };

  // 提交选中的文章
  const handleSubmit = async () => {
    try {
      await fetchAddRecommendArticel(selectedArticles)
      message.success('添加推荐文章成功');
      setVisible(false);
      setSelectedArticles([]);
      getArticleHandle()
    } catch (error) {
      message.error('添加推荐文章失败');
    }
  };


  // 在 useEffect 中初始加载
  useEffect(() => {
    const getArticle = async () => {
      setTableLoading(true);
      const params = {
        pageNo: paginationConfig.current,
        pageSize: paginationConfig.pageSize,
      };
      const res = await queryArticleList(params);
      setTableLoading(false);
      const { data } = res;
      if (Array.isArray(data.data)) {
        setArtilceList(data.data);
        setTotal(data?.count || 0);
      }
    };
    getArticle();
  }, [visible,paginationConfig]);


  const handleTableChange = (pagination) => {
    setPaginationConfig({
      ...paginationConfig,
      ...pagination,
    });
  };

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={showAddModal}>
          添加推荐文章
        </Button>
      </div>

      <Table
        rowKey="uuid"
        columns={columns}
        dataSource={tableData}
        loading={loading}
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
        <Table
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
              disabled: selectedArticles.length >= 3 && !selectedArticles.includes(record.uuid)
            }),
          }}
          dataSource={articleList}
          rowKey="uuid"
          columns={[
            {
              title: '文章标题',
              dataIndex: 'title',
              key: 'title',
            }
          ]}
          onChange={handleTableChange}
          pagination={{ ...paginationConfig, total }}
          loading={tableLoading}
        />
      </Modal>
    </Card>
  );
};

export default RecommendArticle; 