import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Input, Select, Button, Checkbox } from 'antd';
const { Option } = Select;

import { fetchTags } from '@/services/article';

class ArticleAdd extends React.Component {
  state = {
    tags: [],
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  handleStatusChange = value => {
    this.setState({
      status: value,
    });
  };

  componentDidMount() {
    fetchTags().then(res => {
      if (res.success) {
        this.setState({
          tags: res.data,
        });
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
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
              {getFieldDecorator('name')(<Input placeholder="文章标题" />)}
            </Form.Item>
            <Form.Item label="文章标签">
              {getFieldDecorator('article_tag', {})(
                <Checkbox.Group>
                  {this.state.tags.map(tag => (
                    <Checkbox key={tag._id} value={tag.name}>{tag.name}</Checkbox>
                  ))}
                </Checkbox.Group>,
              )}
            </Form.Item>
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
