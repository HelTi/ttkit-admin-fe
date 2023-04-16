import { queryTopCount } from "@/services/data";
import { FilePptTwoTone } from "@ant-design/icons";
import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import VisitorTrendingChart from "./components/visitor-trending-chart";

// import styles from "./index.css";
import("./index.css");

export default function Home() {
  const [topCount, setTopCount] = useState({
    comment: 0,
    article: 0,
    file: 0,
    visitor: 0,
  });

  useEffect(() => {
    async function getData() {
      const res = await queryTopCount();
      console.log("res", res);
      const { code, data } = res;
      if (code === 200) {
        setTopCount(data);
      }
    }
    getData();
  }, []);

  return (
    <div>
      <Row style={{ marginBottom: "10px" }} gutter={10}>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">
            <Card bordered={false}>
              <div className="dataBody">
                <div className="dataIcon">
                  <FilePptTwoTone />
                </div>
                <div className="bodyContent">
                  <span style={{ marginRight: 10 }}> 文章数</span>
                  <span style={{ color: "#eb2f96" }}>{topCount.article}</span>
                </div>
              </div>
            </Card>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">
            <Card bordered={false}>
              <div className="dataBody">
                <div className="dataIcon">
                  <FilePptTwoTone />
                </div>
                <div className="bodyContent">
                  <span style={{ marginRight: 10 }}> 访问数</span>
                  <span style={{ color: "#eb2f96" }}>{topCount.visitor}</span>
                </div>
              </div>
            </Card>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">
            <Card bordered={false}>
              <div className="dataBody">
                <div className="dataIcon">
                  <FilePptTwoTone />
                </div>
                <div className="bodyContent">
                  <span style={{ marginRight: 10 }}> 评论数</span>
                  <span style={{ color: "#eb2f96" }}>{topCount.comment}</span>
                </div>
              </div>
            </Card>
          </div>
        </Col>
        <Col className="gutter-row" span={6}>
          <div className="gutter-box">
            <Card bordered={false}>
              <div className="dataBody">
                <div className="dataIcon">
                  <FilePptTwoTone />
                </div>
                <div className="bodyContent">
                  <span style={{ marginRight: 10 }}> 文件数</span>
                  <span style={{ color: "#eb2f96" }}>{topCount.file}</span>
                </div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
      <VisitorTrendingChart />
    </div>
  );
}
