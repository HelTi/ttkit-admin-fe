import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { fetchTags } from '@/services/article';
import {Tag,Card} from 'antd'

class ArticleTag extends React.Component {
  state = {
    tags: [],
  };

  componentDidMount() {
    fetchTags().then(res => {
      console.log(res);
      let { data } = res;
      this.setState({
        tags: data.map(item => item.name),
      });
      console.log(this.state)
    });
  }
  render() {

    return (
      <Card bordered={false} title='文章标签'>
        {this.state.tags.map((tag,index)=>(<Tag closable={true} key={index}>{tag}</Tag>))}
      </Card>
    );
  }
}

export default ArticleTag;
