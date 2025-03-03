"use client";
import React from "react";
import { Button, Col, Row, Statistic } from "antd";

const StatisticsChartStudent: React.FC = () => (
  <Row gutter={8}>
    <Col span={7}>
      <Statistic title="Active Users" value={112893} />
    </Col>
    <Col span={6}>
      <Statistic title="Account Balance (CNY)" value={112893} precision={2} />
      <Button style={{ marginTop: 16 }} type="primary">
        Recharge
      </Button>
    </Col>
    <Col span={12}>
      <Statistic title="Active Users" value={112893} loading />
    </Col>
  </Row>
);

export default StatisticsChartStudent;
