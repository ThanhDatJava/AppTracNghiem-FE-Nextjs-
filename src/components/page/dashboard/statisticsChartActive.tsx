"use client";
import React from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";

const StatisticsChartActive: React.FC = () => (
  <Row gutter={8}>
    <Col span={6}>
      <Card>
        <Statistic
          title="Active"
          value={11.28}
          precision={2}
          valueStyle={{ color: "#3f8600" }}
          prefix={<ArrowUpOutlined />}
          suffix="%"
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card>
        <Statistic
          title="Idle"
          value={9.3}
          precision={2}
          valueStyle={{ color: "#cf1322" }}
          prefix={<ArrowDownOutlined />}
          suffix="%"
        />
      </Card>
    </Col>
  </Row>
);

export default StatisticsChartActive;
