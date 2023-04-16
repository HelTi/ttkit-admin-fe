import ApiUrl from "@/config/api-url";
import {
  addArticle,
  fetchArticleDetail,
  fetchTags,
  updateArticle,
} from "@/services/article";
import { uploadFile } from "@/services/upload";
import { replaceHtml } from "@/utils/utils";
import { Button, Checkbox, Form, Input, message, Radio } from "antd";
import Editor from "for-editor";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import marked from "./marked";

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

  const setArticleDetail = (data)=>{
    formRef.current?.setFieldsValue({
      title: data.title,
      selectedTags: data.tags.map(tag => tag.name),
      private: data.private,
      type: data.type,
      markdown: data.markdown,
    })
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
    const excerptStr = replaceHtml(content.slice(0, 200));
    params.excerpt =
      excerptStr.length > 137 ? `${excerptStr.slice(0, 137)}...` : excerptStr;

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

  const addImg = ($file) => {
    const formData = new FormData();
    formData.append("file", $file);
    uploadFile(formData)
      .then((res) => {
        console.log("up", res);
        if (res.code === 200) {
          const filePath = `${ApiUrl.ManApiUrl}${res.data.filePath.replace(
            "public",
            ""
          )}`;
          editorRef.current.$img2Url($file.name, filePath);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Form
        name="article-form"
        onFinish={onFinish}
        initialValues={defaultFormValue}
        ref={formRef}
      >
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
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddArtile;
