import storage from "@/utils/storage";
import { Button, Col, Form, Input, Row } from "antd";
import { useNavigate } from "react-router-dom";
import styles from './login.module.scss'
import { fetchCaptcha, userLogin } from "@/services/login";
import { LockOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";

export default function Login() {
  const [captchaUrl, setCaptchaUrl] = useState('')
  const [captchaId, setCaptchaId] = useState('')
  const navigate = useNavigate();

  const refreshCaptcha = useCallback(async () => {
    const res = await fetchCaptcha()
    setCaptchaUrl(res?.image)
    setCaptchaId(res?.captchaId)
  }, [])

  useEffect(() => {
    refreshCaptcha()
  }, [refreshCaptcha])

  const onFinish = async (values) => {
    // 图形验证码id
    values.captchaId = captchaId
    const res = await userLogin(values);

    if (res?.code === 200) {
      const { data } = res;
      // window.localStorage.setItem("token",`Bearer ${data.token}`);
      storage.set("token", `Bearer ${data.token}`);
      navigate("/");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };



  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
  };

  return (
    <>

      <Row align={"center"}>
        <Col md={24} className={styles.topTitle}>
          <h3 className={styles.title}>
            Admin
          </h3>
          <p className={styles.titleSub}>最好用的管理后台</p>
        </Col>
        <Col md={6} xs={24}>
          <Form
            name="login"
            {...formItemLayout}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            style={{ padding: "50px 20px" }}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="用户名" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="密码" />
            </Form.Item>

            <Form.Item
              name="captcha"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="验证码" />
            </Form.Item>
            <Form.Item>
              <div onClick={refreshCaptcha}>
                <span dangerouslySetInnerHTML={{ __html: captchaUrl }}></span>
              </div>

            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
