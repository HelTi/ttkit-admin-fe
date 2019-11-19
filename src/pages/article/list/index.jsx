import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {queryCurrent} from '@/services/user'

class ArticleList extends React.Component {
  componentDidMount(){
    queryCurrent().then(res=>{
      console.log(res)
    })
  }
  render() {
    return (
      <PageHeaderWrapper content=''>
        <div>
          <p>list</p>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default ArticleList;
