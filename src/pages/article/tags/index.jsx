import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { fetchTags, addTag, deleteTag } from '@/services/article';
import { Tag, Card, Icon, Input } from 'antd';

const TagColor = {
  1: 'magenta',
  2: 'red',
  3: 'volcano',
  4: 'orange',
  5: 'gold',
  6: 'lime',
  7: 'green',
  8: 'cyan',
  9: 'blue',
  10: 'geekblue',
};
class ArticleTag extends React.Component {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: '',
  };

  componentDidMount() {
    this.getTags();
  }

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    addTag(inputValue).then(res => {
      if (res.code === 200) {
        this.setState({
          inputVisible: false,
          inputValue: '',
        });
        this.getTags();
      }
    });
  };

  saveInputRef = input => (this.input = input);

  getTags = () => {
    fetchTags().then(res => {
      console.log(res);
      const { data } = res;
      this.setState({
        tags: data,
      });
      console.log(this.state);
    });
  };

  handleClose = removedTag => {
    deleteTag(removedTag._id).then(res => {
      if (res.code === 200) {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({ tags });
      }
    });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false} title="文章标签">
          {tags.map((tag, index) => (
            <Tag
              onClose={() => this.handleClose(tag)}
              color={TagColor[(index + 1) % 10]}
              closable
              key={index}
            >
              {tag.name}
            </Tag>
          ))}
          {inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
              <Icon type="plus" /> New Tag
            </Tag>
          )}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ArticleTag;
