import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Input, Select, Button } from 'antd';
const { Option } = Select;

class ArticleAdd extends React.Component {
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
            <Form.Item label="状态">
              {getFieldDecorator('status', {
                rules: [{ required: false, message: 'Please select your country!' }],
                initialValue: '0',
              })(
                <Select style={{ width: 100 }} onChange={this.handleStatusChange}>
                  <Option value="0">全部</Option>
                  <Option value="1">启用</Option>
                  <Option value="2">禁用</Option>
                </Select>,
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
