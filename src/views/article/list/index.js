import { deleteArticle, queryArticleList } from "@/services/article";
import { useEffect, useState, useCallback } from "react";
import { formatDate } from "@/utils/utils";
import { Table, Button, Tag, message, Modal } from "antd";
import ApiUrl from "@/config/api-url";
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;

export default function ArticleList() {
  const navigate = useNavigate();
  const [articleList, setArticleList] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [paginationConfig, setPaginationConfig] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => <p>共 {total} 条数据</p>,
  });

  const fetchArticles = useCallback(async () => {
    setTableLoading(true);
    const params = {
      pageNo: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    };

    try {
      const res = await queryArticleList(params);
      const { data } = res;
      if (Array.isArray(data?.data)) {
        setArticleList(data.data);
        setTotal(data?.count || 0);
      } else {
        message.error("获取文章列表失败");
      }
    } catch (error) {
      message.error("获取文章列表失败，请稍后重试");
    } finally {
      setTableLoading(false);
    }
  }, [paginationConfig]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleTableChange = (pagination) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      ...pagination,
    }));
  };

  const handleAddArticle = () => navigate("/article/add");

  const handleEditArticle = (uuid) => navigate(`/article/add?uuid=${uuid}`);

  const handleDeleteArticle = (uuid) => {
    confirm({
      title: "警告！",
      content: "确定要删除此文章吗？",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      async onOk() {
        try {
          const res = await deleteArticle(uuid);
          if (res.code === 200) {
            message.success("删除成功！");
            fetchArticles();
          } else {
            message.error("删除失败");
          }
        } catch (error) {
          message.error("删除文章时发生错误，请稍后重试");
        }
      },
    });
  };

  const columns = [
    {
      title: "文章标题",
      dataIndex: "title",
      width: 200,
      ellipsis: true,
      render: (text, record) => (
        <a
          href={`${ApiUrl.StaticUrl}/article/detail/${record.uuid}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text}
        </a>
      ),
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "banner",
      key: "img_url",
      render: (_, record) => (
        <img
          src={record?.img_url}
          alt="banner"
          style={{ width: 95, height: 30 }}
        />
      ),
    },
    {
      title: "标签",
      key: "tags",
      render: (_, record) => (
        <span>
          {record.tags.map((tag) => (
            <Tag key={tag._id}>{tag.name}</Tag>
          ))}
        </span>
      ),
    },
    {
      title: "阅读量",
      dataIndex: "meta",
      render: (meta) => <span>{meta.views}</span>,
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      render: (time) => <span>{formatDate(time)}</span>,
    },
    {
      title: "更新时间",
      dataIndex: "update_time",
      render: (time) => <span>{formatDate(time)}</span>,
    },
    {
      title: "操作",
      width: 150,
      render: (_, record) => (
        <div>
          <Button
            onClick={() => handleEditArticle(record.uuid)}
            type="dashed"
            size="small"
            style={{ marginRight: 8 }}
          >
            编辑
          </Button>
          <Button
            onClick={() => handleDeleteArticle(record.uuid)}
            type="danger"
            size="small"
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="layout-header">
        <Button onClick={handleAddArticle} type="primary">
          新增
        </Button>
      </div>
      <Table
        rowKey={(record) => record._id}
        dataSource={articleList}
        columns={columns}
        pagination={{ ...paginationConfig, total }}
        onChange={handleTableChange}
        loading={tableLoading}
      />
    </div>
  );
}