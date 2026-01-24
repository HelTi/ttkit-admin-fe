import { queryTopCount, type TopCount } from "@/services/data";
import { FilePptTwoTone } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import StatCard from "./components/stat-card";
import VisitorTrendingChart from "./components/visitor-trending-chart";

export default function Home() {
  const [topCount, setTopCount] = useState<TopCount>({
    comment: 0,
    article: 0,
    file: 0,
    visitor: 0,
  });

  useEffect(() => {
    async function getData(): Promise<void> {
      try {
        const res = await queryTopCount();
        const { code, data } = res;
        if (code === 200 && data) {
          setTopCount(data);
        }
      } catch (error) {
        console.error("Failed to fetch top count:", error);
      }
    }
    getData();
  }, []);

  const statCards = [
    { title: "文章数", value: topCount.article, key: "article" },
    { title: "访问数", value: topCount.visitor, key: "visitor" },
    { title: "评论数", value: topCount.comment, key: "comment" },
    { title: "文件数", value: topCount.file, key: "file" },
  ];

  return (
    <div>
      <Row style={{ marginBottom: "10px" }} gutter={10}>
        {statCards.map((card) => (
          <Col key={card.key} className="gutter-row" span={6}>
            <div className="gutter-box">
              <StatCard
                title={card.title}
                value={card.value}
                icon={<FilePptTwoTone />}
              />
            </div>
          </Col>
        ))}
      </Row>
      <VisitorTrendingChart />
    </div>
  );
}
