// src/pages/admin/Analytics.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Card, DatePicker, Select, Row, Col, Spin, Alert, Empty } from 'antd';
import { BarChart, PieChart, LineChart } from '../../components/Charts';//ranges
import DashboardLayout from '../../components/DashboardLayout';
import { AuthContext } from '../../contexts/AuthContext';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Analytics = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');//local
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(6, 'month'),
    dayjs()
  ]);
  const [data, setData] = useState({
    revenue: [],
    orders: [],
    users: [],
    inventory: []
  });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const params = {
        range: timeRange,
        startDate: dateRange[0].toISOString(),
        endDate: dateRange[1].toISOString()
      };

      // First check if we have valid dates
      if (!dateRange[0] || !dateRange[1]) {
        throw new Error('Please select a valid date range');
      }

      // Fetch revenue data
      const revenueResponse = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/admin/analytics/revenue?${new URLSearchParams(params)}`,
        { headers }
      );

      // Check if response is OK
      if (!revenueResponse.ok) {
        const errorText = await revenueResponse.text();
        throw new Error(`Server error: ${revenueResponse.status} - ${errorText}`);
      }

      // Check content type
      const contentType = revenueResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await revenueResponse.text();
        throw new Error(`Expected JSON but got: ${contentType} - ${text.substring(0, 100)}`);
      }

      // Parse JSON safely
      let revenueData;
      try {
        revenueData = await revenueResponse.json();
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        const text = await revenueResponse.text();
        console.error('Response text:', text);
        throw new Error('Failed to parse server response');
      }

      // Validate response structure
      if (!revenueData || !Array.isArray(revenueData.data)) {
        throw new Error('Invalid data format from server');
      }

      // Transform data for charts
      setData(prev => ({
        ...prev,
        revenue: revenueData.data.map(item => ({
          date: item.date || item.month,
          amount: item.totalRevenue || 0,
          count: item.orderCount || 0
        }))
      }));

    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, dateRange, token]);

  const handleDateChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange(dates);
    } else {
      setDateRange([dayjs().subtract(6, 'month'), dayjs()]);
    }
  };

  return (
    <DashboardLayout title="Analytics Dashboard">
      <div className="space-y-6">
        <Card>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select
              value={timeRange}
              style={{ width: 120 }}
              onChange={setTimeRange}
            >
              <Option value="daily">Daily</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="monthly">Monthly</Option>
              <Option value="yearly">Yearly</Option>
            </Select>
            <RangePicker
              value={dateRange}
              onChange={handleDateChange}
              presets={{
                'Last 7 Days': [dayjs().subtract(7, 'day'), dayjs()],
                'Last 30 Days': [dayjs().subtract(30, 'day'), dayjs()],
                'Last 6 Months': [dayjs().subtract(6, 'month'), dayjs()],
                'This Year': [dayjs().startOf('year'), dayjs()],
              }}
            />
          </div>

          {error ? (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              action={
                <button 
                  className="ant-btn ant-btn-primary ant-btn-sm"
                  onClick={fetchAnalytics}
                >
                  Retry
                </button>
              }
            />
          ) : loading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Revenue Trend">
                  {data.revenue.length > 0 ? (
                    <LineChart
                      data={data.revenue}
                      xField="date"
                      yField="amount"
                      color="#1890ff"
                    />
                  ) : (
                    <Empty description="No revenue data available" />
                  )}
                </Card>
              </Col>
            </Row>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;