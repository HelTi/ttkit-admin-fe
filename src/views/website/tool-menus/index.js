import React, { useEffect, useState } from 'react';
import {
  DownOutlined, UploadOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Tree, Table, Button, Modal, Form, Input, Cascader, Radio, message, Popconfirm, Upload } from 'antd';
import { queryCategoryMenus, queryCreateMenu, queryDeleteMenu, queryMenuCategory, queryUpdateMenu } from '@/services/menu';
import { findArrayChildrenData } from '@/utils/utils';
import ApiUrl from '@/config/api-url';
import { getToken } from '@/utils/request';


const defaultFormValue = {
  isMenuCategory: true,
};
const ToolMenus = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [menuCategory, setMenuCategory] = useState([])
  const [categoryMenus, setCategoryMenus] = useState([])
  const [selectCategory, setSelectCategory] = useState(null)
  const [selectMenuCodes, setSelectMenuCodes] = useState([])
  const [currentTreeNode, setCurrentTreeNode] = useState({})
  const [imageUrl, setImageUrl] = useState('')

  const UploadProps = {
    name: 'file',
    action: `${ApiUrl.ManApiUrl}/file/upload`,
    headers: {
      Authorization: getToken(),
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        console.log('done info', info)
        message.success('上传文件成功！');
        const url = ApiUrl.ManApiUrl +'/'+ info?.file?.response?.data?.filePath;
        setImageUrl(url)
      } else if (info.file.status === 'error') {
        message.error('上传文件失败');
      }
    },
  };

  const normFile = (e) => {
    console.log('eeeeee', e)
    if (Array.isArray(e)) {
      return e;
    }
    return ApiUrl.ManApiUrl +'/'+ e?.file?.response?.data?.filePath;
  };


  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      key: 'menuName',
    },
    {
      title: '菜单编码',
      dataIndex: 'menuCode',
      key: 'menuCode',
    },
    {
      title: '上级菜单编码',
      dataIndex: 'parentMenuCode',
      key: 'parentMenuCode',
    },
    {
      title: '菜单图标',
      dataIndex: 'menuIcon',
      key: 'menuIcon',
    },
    {
      title: '菜单URL',
      dataIndex: 'menuUrl',
      key: 'menuUrl',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return <>
          <Button onClick={() => handleDelete(record)}>删除</Button>
          <Button type="link" onClick={() => handleEditMenu(record)}>
            编辑
          </Button>
        </>
      },
    },
  ];

  useEffect(() => {
    queryMenuCategory().then(res => {
      const { code, data } = res
      if (code === 200) {
        setMenuCategory(data)
      }
    })

  }, [])

  useEffect(() => {
    getMenuCategoryMenus(selectMenuCodes)
  }, [selectMenuCodes])

  // 获取类目树
  const getMenuCategory = async () => {
    const res = await queryMenuCategory()
    const { data } = res
    setMenuCategory(data)
  }

  // 获取类目下的菜单数据
  const getMenuCategoryMenus = async (parentMenuCodes = []) => {
    const res = await queryCategoryMenus(parentMenuCodes)
    const { data } = res
    console.log('getMenuCategoryMenus', data)
    setCategoryMenus(data)
  }

  const handleAdd = () => {
    setVisible(true);
  };

  const handleDelete = async (row) => {
    const { menuCode } = row
    const res = await queryDeleteMenu([menuCode])
    console.log('res', res)
    const { code } = res
    if (code === 200) {
      message.info('删除成功！')
      getMenuCategoryMenus()
    }
  };

  // 新增或者更新菜单数据
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      const params = {
        ...values
      };
      const length = params?.submitParentMenuCode?.length
      if (length) {
        params.parentMenuCode = params.submitParentMenuCode[length - 1]
      }
      console.log('params', params)
      if (params.menuCode) {
        //  更新
        await queryUpdateMenu(params.menuCode, params)
      } else {
        const res = await queryCreateMenu(params)
        console.log('res', res)
      }

      if (params.isMenuCategory) {
        getMenuCategory()
      } else {
        getMenuCategoryMenus(selectMenuCodes)
      }

      form.resetFields();
      setVisible(false);
    });
  };

  const onSelect = (selectedKeys, e) => {
    console.log('selectKeys------e', selectedKeys, e)
    const { node } = e
    let codes = findArrayChildrenData([node])
    setSelectMenuCodes(codes)
    console.log('codes', codes)
    setSelectCategory(selectedKeys[0])
    setCurrentTreeNode(node)
  }

  const handleEditMenu = (record) => {
    setVisible(true);
    form.setFieldsValue({
      ...record
    })
  }

  const handleEditCategory = () => {
    handleEditMenu(currentTreeNode)
  }

  const onSelectMenuChange = () => { }

  const confirmDeleteMenuCategory = async (e) => {
    console.log(e);
    const res = await queryDeleteMenu(selectMenuCodes)
    if (res.code === 200) {
      message.success('删除成功！')
      getMenuCategory()
    }
  };
  const cancel = (e) => {
    message.info('已取消')
  };

  const onValuesChange = (changedValues, allValues) => {
    console.log('changedValues, allValues', changedValues, allValues)
  }

  return (
    <Card title={'工具集菜单管理'}>
      <Row>
        <Col span={4} style={{ borderRight: '1px solid #dedede' }}>
          <div style={{ marginBottom: '15px' }}>
            <Popconfirm
              title="提示"
              description="确认删除此菜单吗?"
              onConfirm={confirmDeleteMenuCategory}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
              disabled={!selectCategory}
            >
              <Button danger type="dashed" size='small' disabled={!selectCategory}>删除所选菜单</Button>
            </Popconfirm>
            <Button onClick={handleEditCategory} style={{ marginLeft: 10 }} type="dashed" size='small' disabled={!selectCategory}>编辑所选菜单</Button>
          </div>
          <Tree
            showIcon
            showLine
            defaultExpandAll
            switcherIcon={<DownOutlined />}
            treeData={menuCategory}
            onSelect={onSelect}
            fieldNames={{
              title: 'menuName',
              key: 'menuCode'
            }}
          />
        </Col>
        <Col span={20}>
          <div style={{ paddingLeft: '10px' }}>
            <div>
              <Button onClick={handleAdd}>添加菜单</Button>
              <Table dataSource={categoryMenus} columns={columns} rowKey={(record) => record._id} />

              <Modal
                title="添加菜单"
                open={visible}
                onOk={handleSave}
                onCancel={() => setVisible(false)}
              >
                <Form
                  form={form}
                  labelCol={{ flex: '110px' }}
                  labelAlign="right"
                  labelWrap
                  initialValues={defaultFormValue}
                  onValuesChange={onValuesChange}
                >

                  <Form.Item label="是否是菜单类目" name='isMenuCategory'>
                    <Radio.Group>
                      <Radio value={false}>否</Radio>
                      <Radio value={true}>是</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    name="submitParentMenuCode"
                    label="上级菜单编码"
                    rules={[{ required: false, message: '上级菜单编码来自左侧侧选择的菜单' }]}
                  >
                    <Cascader fieldNames={{ label: 'menuName', value: 'menuCode' }} options={menuCategory} onChange={onSelectMenuChange} changeOnSelect />
                  </Form.Item>
                  <Form.Item
                    name="menuName"
                    label="菜单名称"
                    rules={[{ required: true, message: '请输入菜单名称' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="menuCode"
                    label="菜单编码"
                  >
                    <Input disabled={true} placeholder={'菜单编码，自动生成'} />
                  </Form.Item>
                  <Form.Item
                    label="菜单图标"
                    name='menuIcon'
                    rules={[{ required: false, message: '请输入菜单图标' }]}
                    getValueFromEvent={normFile}
                    valuePropName='file'
                  >
                    {/* <Input />
                    <Button>上传</Button> */}
                    <Upload {...UploadProps} >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="avatar"
                          style={{
                            width: '100%',
                          }}
                        />
                      ) : (
                        <Button icon={<UploadOutlined />}>上传</Button>
                      )}

                    </Upload>
                  </Form.Item>
                  <Form.Item
                    name="menuUrl"
                    label="菜单URL"
                    rules={[{ required: false, message: '请输入菜单URL' }]}
                  >
                    <Input />
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </div>
        </Col>
      </Row>

    </Card>
  )
}

export default ToolMenus;