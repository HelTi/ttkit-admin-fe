import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Input, Button, Checkbox, Radio, message, Icon } from 'antd';
import Editor from 'for-editor';
// import marked from 'marked';
import router from 'umi/router';
// import highlight from 'highlight.js';
import styles from './style.less';
import UtilMarked from './marked'
import { fetchTags, addArticle, fetchArticleDetail, updateArticle } from '@/services/article';
import { uploadFile } from '@/services/upload';
import { replaceHtml } from '@/utils/utils';
import ApiUrl from '@/services/api-url';

// const renderer = new marked.Renderer();

// renderer.heading = (text, level) => {
//   const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
//   return `
//     <h${level}>
//       <a name="${escapedText}" class="anchor" href="#${escapedText}">
//         <span class="header-link"></span>
//       </a>
//       ${text}
//     </h${level}>`;
// };

// marked.setOptions({
//   highlight(code) {
//     return highlight.highlightAuto(code).value;
//   },
//   renderer,
// });

class ArticleAdd extends React.Component {
  constructor() {
    super();
    this.$vm = React.createRef();
  }

  state = {
    tags: [],
    uuid: null,
  };

  componentDidMount() {
    this.getTags();
    this.checkIsEdit();
  }

  getTags = () => {
    fetchTags().then(res => {
      if (res.success) {
        this.setState({
          tags: res.data,
        });
      }
    });
  };

  checkIsEdit = () => {
    const { uuid } = this.props.location.query || null;
    if (uuid) {
      this.setState({
        uuid,
      });
      this.setArticleDetailFormField(uuid);
    }
  };

  setArticleDetailFormField = async uuid => {
    const { data } = await fetchArticleDetail(uuid);
    this.props.form.setFieldsValue({
      title: data.title,
      selectedTags: data.tags.map(tag => tag.name),
      private: data.private,
      type: data.type,
      markdown: data.markdown,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const tags = values.selectedTags.map(tag => ({ name: tag }));
        const renderValue = UtilMarked(values.markdown)
        const content = renderValue.html;
        const { toc } = renderValue
        const params = {
          ...values,
          tags,
          content,
          toc,
        };
        // 文章简介
        const excerptStr = replaceHtml(content.slice(0, 200));
        params.excerpt = excerptStr.length > 137 ? `${excerptStr.slice(0, 137)}...` : excerptStr;

        this.addArticle(params);
      }
    });
  };

  addArticle = params => {
    const { uuid } = this.state;
    if (uuid) {
      // 更新文章
      updateArticle(uuid, params).then(res => {
        if (res.code === 200) {
          message.success('更新文章成功！');
          router.push('/article/list');
        } else {
          message.error('更新文章失败！');
        }
      });
    } else {
      // 新增文章
      addArticle(params).then(res => {
        if (res.code === 200) {
          message.success('添加文章成功！');
          router.push('/article/list');
        } else {
          message.error(res.msg);
        }
      });
    }
  };

  cancleEditHandle = () => {
    router.go(-1);
  };

  addImg($file) {
    console.log($file);
    const formData = new FormData();
    formData.append('img', $file);
    uploadFile(formData)
      .then(res => {
        console.log('up', res);
        if (res.code === 200) {
          this.currentPage = 1;
          const filePath = `${ApiUrl.ManApiUrl}${res.data.path.replace('public', '')}`;
          this.$vm.current.$img2Url($file.name, filePath);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
    };
    const toolbar = {
      img: true, // 图片
      link: true, // 链接
      code: true, // 代码块
      preview: true, // 预览
      expand: true, // 全屏
      undo: true, // 撤销
      redo: true, // 重做
      save: true, // 保存
      subfield: true, // 单双栏模式
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="文章标题">
              {getFieldDecorator('title', { initialValue: '' })(<Input placeholder="文章标题" />)}
            </Form.Item>
            <Form.Item label="文章标签">
              {getFieldDecorator('selectedTags', { initialValue: [] })(
                <Checkbox.Group>
                  {this.state.tags.map(tag => (
                    <Checkbox key={tag._id} value={tag.name}>
                      {tag.name}
                    </Checkbox>
                  ))}
                </Checkbox.Group>,
              )}
            </Form.Item>
            <Form.Item label="是否公开">
              {getFieldDecorator('private', { initialValue: 0 })(
                <Radio.Group>
                  <Radio value={0}>公开</Radio>
                  <Radio value={1}>私有</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="是否原创">
              {getFieldDecorator('type', { initialValue: 1 })(
                <Radio.Group>
                  <Radio value={1}>原创</Radio>
                  <Radio value={2}>转载</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="文章内容">
              {getFieldDecorator('markdown')(
                <Editor
                  height="300px"
                  ref={this.$vm}
                  addImg={$file => this.addImg($file)}
                  toolbar={toolbar}
                />,
              )}
            </Form.Item>
            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 22, offset: 2 },
              }}
            >
              <Button type="primary" htmlType="submit">
                <Icon type="check" />
                保存
              </Button>
              <Button className={styles.marginLeft} type="primary" onClick={this.cancleEditHandle}>
                <Icon type="left" />
                取消
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create({ name: 'article_add_form' })(ArticleAdd);
