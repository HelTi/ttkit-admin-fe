import { deleteArticle, queryArticleList } from "@/services/article";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/utils";
import { Table, Button, Tag, message,Modal } from "antd";
import ApiUrl from "@/config/api-url";
import { useNavigate } from "react-router-dom";

const {confirm} = Modal

export default function ArticleList() {
  const navigate = useNavigate();
  const [articleList, setArtilceList] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [total, setTotal] = useState(0);
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

  const columns = [
    {
      title: "文章标题",
      dataIndex: "title",
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
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "标签",
      key: "tags",
      render: (text, record) => (
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
      render: (text) => <span>{text.views}</span>,
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      render: (text) => <span>{formatDate(text)}</span>,
    },
    {
      title: "更新时间",
      dataIndex: "update_time",
      render: (text) => <span>{formatDate(text)}</span>,
    },
    {
      title: "操作",
      width: 150,
      render: (text, record) => (
        <div>
          <Button
            onClick={() => goEditArticle(record.uuid)}
            type="dashed"
            size="small"
            style={{ marginRight: "8px" }}
          >
            编辑
          </Button>
          <Button
            onClick={() => deleteArticleHandle(record.uuid)}
            type="danger"
            size="small"
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

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
  }, [paginationConfig]);

  const getArticleHandle = async ()=>{
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
  }

  const handleTableChange = (pagination) => {
    setPaginationConfig({
      ...paginationConfig,
      ...pagination,
    });
  };

  const gotoAddArticle = () => {
    navigate("/article/add");
  };

  function goEditArticle(uuid) {
    navigate(`/article/add?uuid=${uuid}`);
  }

  function deleteArticleHandle(uuid) {
    confirm({
      title: "警告！",
      content: "确定要删除此文章吗？",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        deleteArticle(uuid).then((res) => {
          if (res.code === 200) {
            message.success("删除成功！");
            getArticleHandle()
          } else {
            message.error("删除失败");
          }
        });
      },
      onCancel() {},
    });
  }

  return (
    <div>
      <div className="layout-header">
        <Button onClick={gotoAddArticle} type="primary">
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
      ></Table>
    </div>
  );
}
