import React, { useEffect, useState } from 'react';
import {
  CloseOutlined,
  DownOutlined, EditOutlined, PlusOutlined, RedoOutlined, UploadOutlined,
} from '@ant-design/icons';
import { Card, Col, Row, Tree, Table, Button, Modal, Form, Input, Cascader, Radio, message, Popconfirm, Upload } from 'antd';
import { fetchWebsiteFaviconInfo, queryCategoryMenus, queryCreateMenu, queryDeleteMenu, queryMenuCategory, queryUpdateMenu } from '@/services/menu';
import { findArrayChildrenData } from '@/utils/utils';
import ApiUrl from '@/config/api-url';
import { getToken } from '@/utils/request';
import { Tooltip } from 'antd';
import JsonReaderModal from '@/components/json-reader-modal';

const defaultFormValue = {
  isMenuCategory: false,
};
const ToolMenus = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [menuCategory, setMenuCategory] = useState([])
  const [categoryMenus, setCategoryMenus] = useState([])
  const [selectCategory, setSelectCategory] = useState(null)
  const [selectMenuCodes, setSelectMenuCodes] = useState([])
  // 当前点击的tree
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
        const url = ApiUrl.ManApiUrl + '/' + info?.file?.response?.data?.filePath;
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
    return ApiUrl.ManApiUrl + '/' + e?.file?.response?.data?.filePath;
  };


  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      key: 'menuName',
      textWrap: 'word-break',
      ellipsis:true
    },
    {
      title: '备注',
      dataIndex: 'desc',
      key: 'desc',
      // render: (text) => {
      //   return (
      //     <div style={{ maxWidth:200, overflow:"auto" }}>
      //       <p>{text}</p>
      //     </div>
      //   )
      // },
      ellipsis:true
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
      render: (text) => {
        return (
          <div style={{ display: "flex", maxWidth:200, overflow:"auto" }}>
            <img style={{ marginRight: 8 }} width="60px" height="60px" alt={text} src={text} />
            <p>{text}</p>
          </div>
        )
      }
    },
    {
      title: '菜单URL',
      dataIndex: 'menuUrl',
      key: 'menuUrl',
      width:100
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

  // 添加网址
  const handleAddWebsite = () => {
    if (!currentTreeNode?.menuCode) {
      message.error('请现选择类目！')
      return
    }
    setVisible(true);

    const submitParentMenuCode = [...currentTreeNode?.submitParentMenuCode, currentTreeNode?.key]
    console.log('submitParentMenuCode ---', submitParentMenuCode)
    form.setFieldValue('submitParentMenuCode', submitParentMenuCode)
    form.setFieldValue('isMenuCategory', false)
  };

  // 添加菜单类目
  const handleAddCategory = () => {
    if (currentTreeNode?.submitParentMenuCode?.length > 0) {
      message.warning('最多添加二级类目！')
      return
    }
    setVisible(true);
    form.setFieldValue('isMenuCategory', true)
    console.log('currentTreeNode ###-', currentTreeNode)
    // 设置上级菜单编码
    if (currentTreeNode?.menuCode) {

      const submitParentMenuCode = [...currentTreeNode?.submitParentMenuCode, currentTreeNode?.key]
      console.log('submitParentMenuCode ---', submitParentMenuCode)

      form.setFieldValue('submitParentMenuCode', submitParentMenuCode)
    } else {
      form.setFieldValue('submitParentMenuCode', [])
    }
  }

  const handleDelete = async (row) => {
    const { menuCode } = row
    const res = await queryDeleteMenu([menuCode])
    console.log('res', res)
    const { code } = res
    if (code === 200) {
      message.info('删除成功！')
      getMenuCategoryMenus(selectMenuCodes)
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

      // 如果不是类目，且没有选择父级类目拒绝保存
      if (!params.isMenuCategory && !params.parentMenuCode) {
        message.error('该菜单不是菜单类目,请选择上级菜单编码！')
        return
      }
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

  // 关闭弹框
  const handleCloseModal = () => {
    form.resetFields();
    setVisible(false);
    setImageUrl('')
  }

  const onSelect = (selectedKeys, e) => {

    const { node, selected } = e
    console.log('selectKeys------e--node', selectedKeys, e, node)
    let codes = findArrayChildrenData([node])
    setSelectMenuCodes(codes)
    console.log('codes', codes)
    // 如果选中了类目
    if (selected) {
      setSelectCategory(selectedKeys[0])
      setCurrentTreeNode(node)
    } else {
      setSelectCategory(null)
      setCurrentTreeNode(null)
      form.resetFields();
    }
  }

  const handleEditMenu = (record) => {
    setVisible(true);
    console.log('record  ###', record)
    form.setFieldsValue({
      ...record
    })
    //设置图片
    setImageUrl(record?.menuIcon)
  }

  // 编辑类目
  const handleEditCategory = () => {
    console.log('handleEditCategory currentTreeNode ###', currentTreeNode)
    // 填充上级菜单编码	
    const obj = {
      ...currentTreeNode,
      submitParentMenuCode: [...currentTreeNode?.submitParentMenuCode, currentTreeNode?.key]
    }
    handleEditMenu(obj)
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

  const onFetchWebsiteInfo = async () => {
    const menuUrl = form.getFieldValue('menuUrl')
    console.log('menuUrl', menuUrl)
    const res = await fetchWebsiteFaviconInfo(menuUrl)
    const { data } = res
    console.log(data)
    const { faviconUrl, description } = data
    if (faviconUrl) {

      const iconUrl = ApiUrl.ManApiUrl + '/' + faviconUrl
      form.setFieldValue('menuIcon', iconUrl)
      setImageUrl(iconUrl)
    }

    if (description) {
      form.setFieldValue('desc', description)
    }
  }

  // 网址输入框
  const MyInput = (props) => (
    <Row gutter={4}>
      <Col span={20}>
        <Input {...props} />
      </Col>
      <Col span={4}>
        <Button onClick={() => onFetchWebsiteInfo()} type="primary" icon={<RedoOutlined />}></Button>
      </Col>
    </Row>
  )

  // 读取 json 内容成功
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const jsonReadeSuccess = async (data = []) => {
    console.log('json data', data);

    for (const category of data) {
      const cgParams = {
        menuName: category.categoryName,
        isMenuCategory: true,
      };
      const { data: dataRes } = await queryCreateMenu(cgParams);
      const { menuCode } = dataRes;

      for (const c of category.children) {
        // 等待 200 毫秒
        await sleep(500);
        try {
          // 设置图片
          const res = await fetchWebsiteFaviconInfo(c.url);
          const { data } = res;
          console.log(data);

          const { faviconUrl, description } = data;
          let iconUrl = ''
          if (faviconUrl) {
            iconUrl = ApiUrl.ManApiUrl + '/' + faviconUrl
          }
          // 提交
          const params = {
            isMenuCategory: false,
            parentMenuCode: menuCode,
            menuName: c.name,
            menuUrl: c.url,
            menuIcon: iconUrl || '',
            desc: description || '',
            submitParentMenuCode: [menuCode],
          };

          await queryCreateMenu(params);
        } catch (err) {
           console.log('err---',err)
        }

      }
    }
  };
  return (
    <Card title={'工具集菜单管理'} extra={<JsonReaderModal success={jsonReadeSuccess} />} >
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
              <Button danger type="dashed" size='small' icon={<CloseOutlined />} disabled={!selectCategory}></Button>
            </Popconfirm>
            <Button onClick={handleEditCategory} style={{ marginLeft: 10 }} icon={<EditOutlined />} type="dashed" size='small' disabled={!selectCategory}></Button>
            <Tooltip placement="top" title={'新增类目'}>
              <Button onClick={handleAddCategory} style={{ marginLeft: 10 }} icon={<PlusOutlined />} type="dashed" size='small'></Button>
            </Tooltip>
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
              <Button onClick={handleAddWebsite}>添加网址</Button>
              <Table dataSource={categoryMenus} columns={columns} rowKey={(record) => record._id} />

              <Modal
                title="添加菜单"
                open={visible}
                onOk={handleSave}
                onCancel={handleCloseModal}
              >
                <Form
                  form={form}
                  labelCol={{ flex: '126px' }}
                  labelAlign="right"
                  labelWrap
                  initialValues={defaultFormValue}
                  onValuesChange={onValuesChange}
                >

                  <Form.Item label="是否是菜单类目" name='isMenuCategory' >
                    <Radio.Group disabled>
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
                    name="desc"
                    label="描述"
                  >
                    <Input.TextArea rows={2} placeholder="备注" />
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
                            width: 60,
                            height: 60
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
                    rules={[{ required: false, message: '请输入菜单URL' }, { type: 'url' }]}
                  >
                    <MyInput />
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