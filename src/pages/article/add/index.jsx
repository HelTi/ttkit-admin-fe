import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Input, Button, Checkbox, Radio } from 'antd';

import { fetchTags, addArticle } from '@/services/article';

const { TextArea } = Input;

class ArticleAdd extends React.Component {
  state = {
    tags: [],
    isEdit: false,
    id: null,
  };

  componentDidMount() {
    this.getTags()
  }

  getTags= () => {
    fetchTags().then(res => {
      if (res.success) {
        this.setState({
          tags: res.data,
        });
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const tags = values.selectedTags.map(tag => ({ name: tag }))
        const params = {
          ...values,
          tags,
          content: values.markdown,
          excerpt: '简介',
        }
        console.log('p', params)
        this.addArticle(params)
      }
    });
  };

  addArticle = params => {
    addArticle(params).then(res => {
      console.log(res)
    })
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
            <Form.Item label="文章内容">{getFieldDecorator('markdown')(<TextArea />)}</Form.Item>
            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 22, offset: 2 },
              }}
            >
              <Button className="margin-left" type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create({ name: 'article_add_form' })(ArticleAdd);
