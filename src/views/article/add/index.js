import ApiUrl from "@/config/api-url";
import {
  addArticle,
  fetchAiGenerateArticel,
  fetchArticleDetail,
  fetchTags,
  updateArticle,
} from "@/services/article";
import { uploadFile, uploadOssFile } from "@/services/upload";
import { replaceHtml } from "@/utils/utils";
import { Col, Row, Select } from "antd";
import { Button, Checkbox, Form, Input, message, Radio } from "antd";
import Editor from "for-editor";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import marked from "./marked";
import UploadFileButton from "@/components/upload-file-button";

const defaultFormValue = {
  type: 1,
  private: 0,
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

const AddArtile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const editorRef = useRef(null);
  const formRef = useRef(null)
  const uuid = searchParams.get("uuid");
  const [uploadFileType, setUploadFileType] = useState(2)
  const [bannerImgUrl, setBannerImgUrl] = useState('')

  // 切换文件上传类型
  const handleSelectChange = (value) => {
    setUploadFileType(value)
  };

  const fileUploadTypeOptions = [
    { value: 2, label: 'oss上传' },
    { value: 1, label: '本地上传' },
  ]

  useEffect(() => {
    fetchTags().then((res) => {
      if (res.code === 200) {
        setTags(res.data);
      }
    });
  }, []);

  useEffect(() => {
    async function getArticleDetail() {
      if (uuid) {
        const res = await fetchArticleDetail(uuid);
        setArticleDetail(res?.data || {})
      }
    }
    getArticleDetail();
  }, [uuid]);

  const setArticleDetail = (data) => {
    formRef.current?.setFieldsValue({
      title: data.title,
      selectedTags: data.tags.map(tag => tag.name),
      private: data.private,
      type: data.type,
      markdown: data.markdown,
      excerpt: data?.excerpt
    })
    // 设置 banner 地址
    setBannerImgUrl(data?.img_url)
  }

  const onFinish = (values) => {
    console.log("values--", values);
    const tags = values.selectedTags.map((tag) => ({ name: tag }));
    const renderValue = marked(values.markdown);
    const content = renderValue.html;
    const { toc } = renderValue;
    const params = {
      ...values,
      tags,
      content,
      toc,
    };
    // 文章简介
    if (!values.excerpt) {
      const excerptStr = replaceHtml(content.slice(0, 200));
      params.excerpt =
        excerptStr.length > 137 ? `${excerptStr.slice(0, 137)}...` : excerptStr;
    }


    requestSubmitHandle(params);
  };

  const requestSubmitHandle = (params) => {
    if (uuid) {
      // 更新文章
      updateArticle(uuid, params).then((res) => {
        if (res.code === 200) {
          message.success("更新文章成功！");
          navigate("/article/list");
        } else {
          message.error("更新文章失败！");
        }
      });
    } else {
      // 新增文章
      addArticle(params).then((res) => {
        if (res.code === 200) {
          message.success("添加文章成功！");
          navigate("/article/list");
        } else {
          message.error(res.msg);
        }
      });
    }
  };

  // 设置文件地址
  const setFileUlr = (type, filePath = '') => {
    // oss地址
    if (type === 2) {
      return filePath
    } else {
      // 本地上传地址
      return `${ApiUrl.ManApiUrl}${filePath.replace("public", "")}`
    }
  }
  // 上传图片
  const addImg = ($file) => {
    const formData = new FormData();
    formData.append("file", $file);
    let uploadFun = () => { }
    if (uploadFileType === 2) {
      uploadFun = uploadOssFile
    } else {
      uploadFun = uploadFile
    }
    uploadFun(formData)
      .then((res) => {
        console.log("up", res);
        if (res.code === 200) {
          const filePath = setFileUlr(uploadFileType, res?.data?.filePath)
          editorRef.current.$img2Url($file.name, filePath);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };


  //  上传banner 文件成功
  const uploadBannerFileSuccess = (filePath) => {
    const p = uploadFileType === 2 ? filePath : `${ApiUrl.ManApiUrl}/${filePath}`
    setBannerImgUrl(p)
    formRef.current?.setFieldValue('img_url', p)
  }

  // 上传 文章banner
  const UpladArticleBanner = (props) => {
    console.log('props---', props)
    return (
      <Row gutter={4}>
        <Col>
          <UploadFileButton uploadFileType={uploadFileType} uploadSuccess={uploadBannerFileSuccess} />
        </Col>
        <Col>
          <img alt="图片" style={{ width: 160, height: 90 }} src={bannerImgUrl} />
        </Col>
      </Row>
    )
  }

  // AI 生成文章
  const GenerateAiArticle = async () => {
    const params = {
      "topic": formRef.current?.getFieldValue('title'),
      "language": "zh",
      "style": "professional",
    }
    const res = await fetchAiGenerateArticel(params)
    console.log('res--', res)
    formRef.current?.setFieldsValue({
      markdown:res?.content,
      excerpt: res?.summary
    })

  }

  return (
    <div>
      <Form
        name="article-form"
        onFinish={onFinish}
        initialValues={defaultFormValue}
        ref={formRef}
        labelCol={{ span: 2 }}
      >
        <Form.Item label="图片上传类型">
          <Select
            defaultValue={uploadFileType}
            options={fileUploadTypeOptions}
            onChange={handleSelectChange}
          />
        </Form.Item>

        <Form.Item
          label="文章标题"
          name="title"
          rules={[
            {
              required: true,
              message: "请输入文章标题",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="文章标签" name={"selectedTags"}>
          <Checkbox.Group>
            {tags.map((tag) => (
              <Checkbox key={tag._id} value={tag.name}>
                {tag.name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item label="是否公开" name={"private"}>
          <Radio.Group>
            <Radio value={0}>公开</Radio>
            <Radio value={1}>私有</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="是否原创" name={"type"}>
          <Radio.Group>
            <Radio value={1}>原创</Radio>
            <Radio value={2}>转载</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="文章banner" name={'img_url'}>
          <UpladArticleBanner />
        </Form.Item>

        <Form.Item
          label="文章简介"
          name="excerpt"
          rules={[
            {
              required: false,
              message: "请输入文章简介",
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="请输入文章简介"
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Form.Item label="文章内容" name={"markdown"}>
          <Editor
            height="300px"
            toolbar={toolbar}
            ref={editorRef}
            addImg={addImg}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <Button type="primary" onClick={() => GenerateAiArticle()}>
            AI 生成
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddArtile;
