"use client";
import React from "react";
import { Area, Bar, Funnel, Gauge, Line, Radar } from "@ant-design/charts";

const StatisticsChartBar: React.FC = () => {
  const data = [
    { type: "Tháng 1", value: 10 },
    { type: "Tháng 2", value: 20 },
    { type: "Tháng 3", value: 30 },
    { type: "Tháng 4", value: 50 },
    { type: "Tháng 5", value: 60 },
    { type: "Tháng 6", value: 70 },
  ];

  const config = {
    data,
    xField: "type",
    yField: "value",
    label: {
      position: "top", // Use "top" or "bottom" for external positioning
      style: {
        fill: "#ffffff", // Label color
        opacity: 0.6, // Label transparency
      },
    },
    color: "#2f54eb", // Bar color
    width: 500, // Set the width of the chart
    height: 250, // Set the height of the chart
  };

  return <Bar {...config} />;
};

export default StatisticsChartBar;
