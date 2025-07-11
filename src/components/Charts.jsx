// src/components/Charts.jsx
import React from 'react';
import { Line, Bar, Pie } from '@ant-design/charts';

export const LineChart = ({ data, xField, yField, color }) => {
  const config = {
    data,
    xField,
    yField,
    color,
    height: 300,
    point: { size: 4, shape: 'circle' },
    xAxis: { label: { autoRotate: true } },
    smooth: true
  };
  return <Line {...config} />;
};

export const BarChart = ({ data, xField, yField, color }) => {
  const config = {
    data,
    xField,
    yField,
    color,
    height: 300,
    barWidthRatio: 0.6,
    xAxis: { label: { autoRotate: true } }
  };
  return <Bar {...config} />;
};

export const PieChart = ({ data, angleField, colorField, radius }) => {
  const config = {
    data,
    angleField,
    colorField,
    height: 300,
    radius,
    label: { type: 'inner', offset: '-30%', content: '{name}' },
    interactions: [{ type: 'element-active' }]
  };
  return <Pie {...config} />;
};