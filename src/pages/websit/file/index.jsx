import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { fetchUploadList } from '@/services/websit';
import { Card, Table, Upload, message, Button, Icon } from 'antd';
import ApiUrl from '@/services/api-url';
import { formatDate } from '@/utils/utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const byte2kb = val => (val / 1024).toFixed(2)
const columns = [
  {
    title: '文件名',
    dataIndex: 'name',
  },
  {
    title: '预览',
    render: (text, record) => (
      <div>
        <img
          alt=""
          style={{ width: 50 }}
          src={`${ApiUrl.ManApiUrl}${record.filePath.replace('public', '')}`}
        />
      </div>
    ),
  },
  {
    title: '文件路径',
    render: (text, record) => (
      <CopyToClipboard text={`${ApiUrl.ManApiUrl}${record.filePath.replace('public', '')}`} onCopy={() => message.success('复制文本成功！')}>
        <span style={{ cursor: 'pointer' }}>{`${ApiUrl.ManApiUrl}${record.filePath.replace('public', '')}`}</span>
      </CopyToClipboard>
    ),
  },
  {
    title: '文件大小',
    dataIndex: 'size',
    render: text => (`${byte2kb(text)}kb`),
  },
  {
    title: '上传时间',
    dataIndex: 'upload_date',
    render: text => <span>{formatDate(text)}</span>,
  },
];

class WebsitPhoto extends React.PureComponent {
  state = {
    fileList: [],
    loading: true,
    paginationConfig: {
      current: 1,
      pageSize: 10,
      total: 100,
      showSizeChanger: true,
      showTotal: total => (
        <>
          <p>共{total}条数据</p>
        </>
      ),
    },
  };

  componentDidMount() {
    this.getUploadList();
  }

  getUploadList = () => {
    this.setState({
      loading: true,
    });
    const { paginationConfig } = this.state;
    const parmas = {
      page: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    };
    fetchUploadList(parmas).then(res => {
      if (res.code === 200) {
        const { data } = res;
        paginationConfig.total = data.count;
        this.setState({
          fileList: data.data,
          loading: false,
          paginationConfig,
        });
      }
    });
  };

  onChangeHandle = pagination => {
    const { paginationConfig } = this.state;
    paginationConfig.pageSize = pagination.pageSize;
    paginationConfig.current = pagination.current;
    if (this.state.paginationConfig.pageSize !== pagination.pageSize) {
      paginationConfig.current = 1;
    }
    this.setState({
      paginationConfig,
    });
    this.getUploadList();
  };

  render() {
    const that = this;
    const { fileList } = this.state;
    const UploadProps = {
      name: 'file',
      action: `${ApiUrl.ManApiUrl}/file/upload`,
      headers: {
        Authorization: localStorage.getItem('token'),
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success('上传文件成功！');
          that.getUploadList();
        } else if (info.file.status === 'error') {
          message.error('上传文件失败');
        }
      },
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="card-top" style={{ marginBottom: '20px' }}>
            <Upload {...UploadProps}>
              <Button>
                <Icon type="upload" /> 上传文件
              </Button>
            </Upload>
          </div>
          <div className="tableContent">
            <Table
              rowKey={record => record._id}
              columns={columns}
              onChange={this.onChangeHandle}
              dataSource={fileList}
              pagination={this.state.paginationConfig}
              loading={this.state.loading}
            ></Table>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default WebsitPhoto;
