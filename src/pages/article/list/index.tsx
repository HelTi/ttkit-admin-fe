import ApiUrl from '@/config/api-url';
import {
  fetchTags,
  queryArticleList,
  type Article,
  type QueryArticleParams,
  type Tag,
} from '@/services/article';
import {
  PageContainer,
  ProTable,
  type ActionType,
  type ProColumns,
} from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { Tag as AntTag, Button, message, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

const ArticleList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [tagOptions, setTagOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const navigate = useNavigate();
  // 获取标签列表用于搜索
  useEffect(() => {
    const loadTags = async () => {
      try {
        const res = await fetchTags();
        if (res.code === 200 && res.data) {
          setTagOptions(
            res.data.map((tag: Tag) => ({
              label: tag.name,
              value: tag.name,
            })),
          );
        }
      } catch (error) {
        console.error('获取标签列表失败:', error);
      }
    };
    loadTags();
  }, []);

  const columns: ProColumns<Article>[] = [
    {
      title: '文章标题',
      dataIndex: 'title',
      ellipsis: true,
      copyable: true,
      width: 300,
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
      title: '作者',
      dataIndex: 'author',
      search: false,
    },
    {
      title: 'banner',
      key: 'img_url',
      search: false,
      width: 130,
      render: (_, record) => (
        <img
          src={record?.img_url}
          alt="banner"
          style={{ width: 95, height: 30 }}
        />
      ),
    },
    {
      title: '标签',
      dataIndex: 'tag',
      valueType: 'select',
      valueEnum: tagOptions.reduce((acc, item) => {
        acc[item.value] = { text: item.label };
        return acc;
      }, {} as Record<string, { text: string }>),
      render: (_, record) => (
        <div>
          {record.tags?.map((tag) => (
            <AntTag key={tag._id}>{tag.name}</AntTag>
          ))}
        </div>
      ),
    },
    {
      title: '是否私有',
      dataIndex: 'private',
      valueType: 'select',
      valueEnum: {
        0: { text: '公开', status: 'Default' },
        1: { text: '私有', status: 'Error' },
      },
      search: {
        transform: (value) => ({ private: value }),
      },
    },
    {
      title: '阅读量',
      dataIndex: 'views',
      valueType: 'digit',
      render: (_, record) => <span>{record.meta?.views || 0}</span>,
      search: {
        transform: (value) => {
          if (typeof value === 'number') {
            return { views: value };
          }
          return {};
        },
      },
    },
    {
      title: '阅读量范围',
      dataIndex: 'viewsRange',
      valueType: 'digitRange',
      hideInTable: true,
      search: {
        transform: (value: [number, number] | undefined) => {
          if (value && Array.isArray(value) && value.length === 2) {
            return {
              viewsMin: value[0],
              viewsMax: value[1],
            };
          }
          return {};
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      search: false,
      render: (_, record) => {
        return record.create_time
          ? dayjs(record.create_time).format('YYYY-MM-DD HH:mm:ss')
          : '-';
      },
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      valueType: 'dateTimeRange',
      render: (_, record) => {
        return record.update_time
          ? dayjs(record.update_time).format('YYYY-MM-DD HH:mm:ss')
          : '-';
      },
      search: {
        transform: (value: [string, string] | undefined) => {
          if (value && Array.isArray(value) && value.length === 2) {
            return {
              updateTimeStart: value[0],
              updateTimeEnd: value[1],
            };
          }
          return {};
        },
      },
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              navigate(`/article/add?uuid=${record.uuid}`);
            }}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      ghost
      header={{
        title: '文章列表',
      }}
    >
      <ProTable<Article, QueryArticleParams>
        rowKey="_id"
        actionRef={actionRef}
        headerTitle="文章列表"
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        search={{
          optionRender: (props, config, dom) => {
            return [
              <Button
                type="primary"
                key="new"
                onClick={() => {
                  navigate('/article/add');
                }}
              >
                新增文章
              </Button>,
              ...dom,
            ];
          },
        }}
        request={async (params) => {
          const {
            current,
            pageSize,
            title,
            tag,
            private: privateValue,
            views,
            viewsMin,
            viewsMax,
            updateTimeStart,
            updateTimeEnd,
          } = params as QueryArticleParams & {
            current?: number;
            pageSize?: number;
          };

          // 构建查询参数
          const queryParams: QueryArticleParams = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            title: title as string | undefined,
            tag: tag as string | undefined,
            private: privateValue as 0 | 1 | undefined,
            views: views as number | undefined,
            viewsMin: viewsMin as number | undefined,
            viewsMax: viewsMax as number | undefined,
            updateTimeStart: updateTimeStart as string | Date | undefined,
            updateTimeEnd: updateTimeEnd as string | Date | undefined,
          };

          try {
            const res = await queryArticleList(queryParams);
            return {
              data: res.data?.data || [],
              total: res.data?.count || 0,
              success: res.code === 200,
            };
          } catch (error) {
            message.error('获取文章列表失败');
            return {
              data: [],
              total: 0,
              success: false,
            };
          }
        }}
      />
    </PageContainer>
  );
};

export default ArticleList;
