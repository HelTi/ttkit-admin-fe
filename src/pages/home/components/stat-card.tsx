import { Card } from "antd";
import { ReactNode } from "react";
import "../index.css";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  color = "#eb2f96",
}: StatCardProps) {
  return (
    <Card>
      <div className="dataBody">
        <div className="dataIcon">{icon}</div>
        <div className="bodyContent">
          <span style={{ marginRight: 10 }}>{title}</span>
          <span style={{ color }}>{value}</span>
        </div>
      </div>
    </Card>
  );
}

