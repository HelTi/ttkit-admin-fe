import { Col } from "antd";
import { Row } from "antd";
import { Card } from "antd";
import UserInfoForm from "./components/userInfoForm";

export default function UserInfo(){
  return (
   <Card title="用户信息" bordered={false}>
    <Row>
      <Col span={12}>
        <UserInfoForm />
      </Col>
    </Row>
   </Card>
  )
}