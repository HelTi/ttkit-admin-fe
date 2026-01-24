import {
  addArticle,
  fetchArticleDetail,
  fetchTags,
  updateArticle,
  type Article,
  type CreateArticleDto,
  type Tag,
  type TagItem,
} from '@/services/article';
import { uploadFile, uploadOssFile } from '@/services/upload';
import { useUserStore } from '@/store/user';
import {
  PageContainer,
  ProForm,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import MDEditor, {
  commands,
  ICommand,
  TextAreaTextApi,
  TextState,
} from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { useNavigate, useSearchParams } from '@umijs/max';
import { Col, message, Row } from 'antd';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { marked } from 'marked';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.module.less';
import ApiUrl from '@/config/api-url';

// 配置 marked 选项，支持代码高亮
marked.setOptions({
  breaks: true,
  gfm: true,
  highlight: function (code: string, lang: string) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
} as any);

/**
 * 从 Markdown 内容中提取目录（TOC）
 * 提取所有标题（# 到 ######）
 */
const extractToc = (markdown: string): string[] => {
  if (!markdown) return [];

  const lines = markdown.split('\n');
  const toc: string[] = [];

  for (const line of lines) {
    // 匹配标题行：以 # 开头，后跟空格，然后是标题文本
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const title = match[2].trim();
      // 移除标题中的链接格式 [text](url) -> text
      const cleanTitle = title.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      toc.push(cleanTitle);
    }
  }

  return toc;
};

const AddArticle: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editUuid = searchParams.get('uuid');
  const isEditMode = useMemo(() => !!editUuid, [editUuid]);
  const { userInfo } = useUserStore();
  const [tagOptions, setTagOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [uploadType, setUploadType] = useState<'local' | 'oss'>('oss'); // 上传方式：本地上传 或 OSS上传
  const formRef = useRef<ProFormInstance<CreateArticleDto>>(null);

  // 获取标签列表
  useEffect(() => {
    const loadTags = async () => {
      try {
        const res = await fetchTags();
        if (res.code === 200 && res.data) {
          setTagOptions(
            res.data.map((tag: Tag) => ({
              label: tag.name,
              value: tag._id || tag.name,
            })),
          );
        }
      } catch (error) {
        console.error('获取标签列表失败:', error);
      }
    };
    loadTags();
  }, []);

  // 如果是编辑模式，加载文章详情并填充表单
  useEffect(() => {
    if (!editUuid) return;

    const loadDetail = async () => {
      try {
        const res = await fetchArticleDetail(editUuid);
        if (res.code === 200 && res.data) {
          const detail = res.data as Article & {
            markdown?: string;
            content?: string;
            excerpt?: string;
            private?: 0 | 1;
            type?: 1 | 2;
          };

          // 设置 Markdown 和 HTML 内容
          if (detail.markdown) {
            setMarkdownContent(detail.markdown);
          }
          if (detail.content) {
            setHtmlContent(detail.content);
          }

          // 处理标签字段为表单可用的值
          const tagIds =
            detail.tags?.map((tag) => {
              return tag._id || tag.name;
            }) || [];

          // 处理封面图片为上传组件可识别的格式
          const imgFileList = detail.img_url
            ? [
                {
                  uid: '-1',
                  name: '封面图片',
                  url: detail.img_url,
                  status: 'done',
                },
              ]
            : undefined;

          // 正确方式：通过 form 实例设置表单值
          formRef.current?.setFieldsValue({
            title: detail.title,
            // 上传组件的值是文件列表
            img_url: imgFileList as any,
            private: (detail as any).private ?? 0,
            type: (detail as any).type ?? 1,
            // 下方 markdown 实际由编辑器 state 控制，这里只是保证表单值与之同步
            markdown: detail.markdown || '',
            content: detail.content || '',
            excerpt: (detail as any).excerpt || '',
            author: detail.author,
            tags: tagIds as any,
          } as any);
        }
      } catch (error) {
        console.error('获取文章详情失败:', error);
        message.error('获取文章详情失败');
      }
    };

    loadDetail();
  }, [editUuid]);

  // Markdown 转 HTML
  useEffect(() => {
    if (markdownContent) {
      const html = marked(markdownContent) as string;
      setHtmlContent(html);
    } else {
      setHtmlContent('');
    }
  }, [markdownContent]);

  // 处理表单提交（新增/编辑共用）
  const handleSubmit = async (values: any) => {
    try {
      // 验证必填字段
      if (!markdownContent.trim()) {
        message.error('请输入文章内容');
        return;
      }

      if (!htmlContent.trim()) {
        message.error('文章内容转换失败，请检查 Markdown 格式');
        return;
      }

      // 处理标签
      const tags: TagItem[] = values.tags
        ? values.tags.map((tagId: string) => {
            const tag = tagOptions.find((t) => t.value === tagId);
            return {
              _id: tagId,
              name: tag?.label || tagId,
            };
          })
        : [];

      // 处理封面图片
      let imgUrl = '';
      if (values.img_url && values.img_url.length > 0) {
        const file = values.img_url[0];
        // ProFormUploadButton 上传成功后，URL 可能在 response 中
        if (file.response) {
          imgUrl =
            typeof file.response === 'string'
              ? file.response
              : file.response.url || file.response.data?.url || '';
        } else if (file.url) {
          imgUrl = file.url;
        }
      }

      // 提取目录
      const toc = extractToc(markdownContent);

      // 构建提交参数，严格按照 CreateArticleDto 类型
      const params: CreateArticleDto = {
        title: values.title.trim(),
        img_url: imgUrl || undefined,
        private: values.private as 0 | 1,
        type: values.type as 1 | 2,
        markdown: markdownContent,
        content: htmlContent,
        excerpt: values.excerpt.trim(),
        author: values.author.trim(),
        tags: tags.length > 0 ? tags : undefined,
        toc: toc.length > 0 ? toc : undefined,
      };

      // 根据是否有 uuid 来判断是新增还是编辑
      if (isEditMode && editUuid) {
        const res = await updateArticle(editUuid, params);
        if (res.code === 200) {
          message.success('文章更新成功');
          navigate('/article/list');
        } else {
          message.error(res.message || '文章更新失败');
        }
      } else {
        const res = await addArticle(params);
        if (res.code === 200) {
          message.success('文章创建成功');
          navigate('/article/list');
        } else {
          message.error(res.message || '文章创建失败');
        }
      }
    } catch (error) {
      console.error('提交文章失败:', error);
      message.error('提交文章失败，请重试');
    }
  };

  // 自定义上传处理（用于封面图片）
  const handleUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = uploadType === 'oss' 
        ? await uploadOssFile(formData)
        : await uploadFile(formData);
      console.log('res upload', res);
      if (res.code === 200 && res.data) {
        return res.data?.filePath;
      }
      throw new Error('上传失败');
    } catch (error) {
      message.error('图片上传失败');
      throw error;
    }
  };

  // Markdown 编辑器图片上传处理
  const handleImageUpload = async (file: File): Promise<string> => {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      throw new Error('请上传图片文件');
    }

    // 验证文件大小（限制为 10MB）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('图片大小不能超过 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = uploadType === 'oss'
        ? await uploadOssFile(formData)
        : await uploadFile(formData);
      console.log('res upload image', res);
      if (res.code === 200 && res.data) {
        const imageUrl = res.data?.filePath;

        return imageUrl;
      }
      throw new Error(res.message || '上传失败');
    } catch (error: any) {
      const errorMessage = error?.message || '图片上传失败';
      message.error(errorMessage);
      throw error;
    }
  };

  // 创建自定义图片上传命令
  const uploadImageCommand: ICommand = {
    name: 'upload-image',
    keyCommand: 'image',
    buttonProps: { 'aria-label': '上传图片', title: '上传图片' },
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 4C3 2.89543 3.89543 2 5 2H15C16.1046 2 17 2.89543 17 4V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M7 8C7.55228 8 8 7.55228 8 7C8 6.44772 7.55228 6 7 6C6.44772 6 6 6.44772 6 7C6 7.55228 6.44772 8 7 8Z"
          fill="currentColor"
        />
        <path
          d="M3 13L7 9L11 13L15 9L17 11V16H3V13Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    execute: (state: TextState, api: TextAreaTextApi) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = false;
      input.onchange = async () => {
        const file = input.files?.[0];
        if (file) {
          try {
            message.loading({ content: '图片上传中...', key: 'upload' });
            const imageUrl = await handleImageUpload(file);
            message.success({ content: '图片上传成功', key: 'upload' });
            // 插入图片 markdown 语法
            const imageMarkdown = `![${file.name}](${imageUrl})`;
            api.replaceSelection(imageMarkdown);
          } catch (error) {
            // 错误已在 handleImageUpload 中处理
          }
        }
      };
      input.click();
    },
  };

  return (
    <PageContainer
      ghost
      header={{
        title: isEditMode ? '编辑文章' : '新增文章',
      }}
    >
      <ProForm<CreateArticleDto>
        formRef={formRef}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          author: userInfo.name || 'admin',
          private: 0,
          type: 1,
          upload_type: 'oss',
        }}
        submitter={{
          searchConfig: {
            submitText: isEditMode ? '保存修改' : '提交',
            resetText: '重置',
          },
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <ProFormText
              name="title"
              label="文章标题"
              placeholder="请输入文章标题"
              rules={[{ required: true, message: '请输入文章标题' }]}
              fieldProps={{
                size: 'large',
              }}
            />

            <ProFormSelect
              name="upload_type"
              label="上传方式"
              options={[
                { label: '本地上传', value: 'local' },
                { label: 'OSS上传', value: 'oss' },
              ]}
              fieldProps={{
                value: uploadType,
                onChange: (value) => setUploadType(value),
              }}
              rules={[{ required: true, message: '请选择上传方式' }]}
              extra="选择文件上传到本地上传服务器或OSS对象存储"
            />

            <ProFormUploadButton
              name="img_url"
              label="文章封面"
              max={1}
              fieldProps={{
                listType: 'picture-card',
                accept: 'image/*',
                customRequest: async (options) => {
                  const { file, onSuccess, onError } = options;
                  try {
                    // 调用自定义上传函数
                    const url = await handleUpload(file as File);
                    console.log('url', url);
                    
                    // 构建完整的图片URL
                    let fullUrl = url;
                    if (uploadType === 'local') {
                      // 如果是本地上传，确保是完整的URL
                      fullUrl = url.startsWith('http') 
                        ? url 
                        : `${ApiUrl.ManApiUrl}/${url.replace(/^\//, '')}`;
                    }
                    
                    // 直接设置文件对象的url，这样预览时会直接使用这个URL作为img的src
                    // 不会被axios拦截器处理
                    const fileObj = file as any;
                    if (fileObj) {
                      fileObj.url = fullUrl;
                      fileObj.status = 'done';
                    }
                    
                    // 调用成功回调，传入URL作为response
                    onSuccess?.(fullUrl, fileObj as any);
                  } catch (error) {
                    console.error('上传失败:', error);
                    onError?.(error as Error);
                  }
                },
              }}
              extra="支持 JPG、PNG 格式，建议尺寸 1200x600"
            />

            <ProFormRadio.Group
              name="private"
              label="是否私有"
              options={[
                { label: '公开', value: 0 },
                { label: '私有', value: 1 },
              ]}
              rules={[{ required: true, message: '请选择是否私有' }]}
            />

            <ProFormRadio.Group
              name="type"
              label="文章类型"
              options={[
                { label: '原创', value: 1 },
                { label: '转载', value: 2 },
              ]}
              rules={[{ required: true, message: '请选择文章类型' }]}
            />

            <ProFormText
              name="author"
              label="文章作者"
              placeholder="请输入文章作者"
              rules={[{ required: true, message: '请输入文章作者' }]}
            />

            <ProFormTextArea
              name="excerpt"
              label="文章摘要"
              placeholder="请输入文章摘要，将显示在文章列表和详情页"
              rules={[
                { required: true, message: '请输入文章摘要' },
                { max: 200, message: '摘要长度不能超过200个字符' },
              ]}
              fieldProps={{
                rows: 3,
                maxLength: 200,
                showCount: true,
              }}
            />

            <ProFormSelect
              name="tags"
              label="文章标签"
              mode="multiple"
              options={tagOptions}
              placeholder="请选择文章标签"
              fieldProps={{
                allowClear: true,
              }}
            />
          </Col>

          <Col span={16}>
            <ProForm.Item
              name="markdown"
              label="文章内容 (Markdown)"
              rules={[
                { required: true, message: '请输入文章内容' },
                {
                  validator: () => {
                    if (!markdownContent.trim()) {
                      return Promise.reject(new Error('请输入文章内容'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              extra="支持 Markdown 格式，实时预览。点击工具栏图片按钮或直接粘贴图片可上传。目录将自动从标题中提取。"
            >
              <div className={styles.markdownEditor}>
                <MDEditor
                  value={markdownContent}
                  onChange={(value) => setMarkdownContent(value || '')}
                  preview="live"
                  hideToolbar={false}
                  visibleDragbar={true}
                  height={600}
                  style={{
                    width: '100%',
                  }}
                  data-color-mode="light"
                  commands={[...commands.getCommands(), uploadImageCommand]}
                  textareaProps={{
                    placeholder:
                      '请输入 Markdown 格式的文章内容...\n\n例如：\n# 标题\n## 二级标题\n正文内容...',
                    onPaste: async (event) => {
                      // 支持粘贴图片上传
                      const items = event.clipboardData?.items;
                      if (!items) return;

                      for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        if (item.type.indexOf('image') !== -1) {
                          event.preventDefault();
                          const file = item.getAsFile();
                          if (file) {
                            try {
                              message.loading({
                                content: '图片上传中...',
                                key: 'paste-upload',
                              });
                              const imageUrl = await handleImageUpload(file);
                              message.success({
                                content: '图片上传成功',
                                key: 'paste-upload',
                              });
                              // 在光标位置插入图片
                              const imageMarkdown = `![${file.name}](${imageUrl})\n`;
                              console.log('imageMarkdown', imageMarkdown);
                              const textarea =
                                event.target as HTMLTextAreaElement;
                              const start = textarea.selectionStart;
                              const end = textarea.selectionEnd;
                              const currentValue = markdownContent;
                              const newValue =
                                currentValue.substring(0, start) +
                                imageMarkdown +
                                currentValue.substring(end);
                              setMarkdownContent(newValue);
                            } catch (error) {
                              message.error({
                                content: '图片上传失败',
                                key: 'paste-upload',
                              });
                            }
                          }
                          break;
                        }
                      }
                    },
                    onDrop: async (event) => {
                      // 支持拖拽图片上传
                      event.preventDefault();
                      const files = event.dataTransfer?.files;
                      if (!files || files.length === 0) return;

                      const imageFiles = Array.from(files).filter((file) =>
                        file.type.startsWith('image/'),
                      );
                      if (imageFiles.length === 0) return;

                      for (const file of imageFiles) {
                        try {
                          message.loading({
                            content: `正在上传 ${file.name}...`,
                            key: `drop-upload-${file.name}`,
                          });
                          const imageUrl = await handleImageUpload(file);
                          message.success({
                            content: `${file.name} 上传成功`,
                            key: `drop-upload-${file.name}`,
                          });
                          // 在光标位置插入图片
                          const imageMarkdown = `![${file.name}](${imageUrl})\n`;
                          setMarkdownContent((prev) => prev + imageMarkdown);
                        } catch (error) {
                          message.error({
                            content: `${file.name} 上传失败`,
                            key: `drop-upload-${file.name}`,
                          });
                        }
                      }
                    },
                  }}
                />
              </div>
            </ProForm.Item>
          </Col>
        </Row>
      </ProForm>
    </PageContainer>
  );
};

export default AddArticle;
