// src/pages/admin/Orders.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select, Table, Tag } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import DashboardLayout from '../../components/DashboardLayout';
import { AuthContext } from '../../contexts/AuthContext';

const Orders = () => {
  const {token} = useContext(AuthContext)
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState({ status: '', search: '' });
  const navigate = useNavigate();

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' } 
  ];

  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      render: (id) => `#${id.slice(-6).toUpperCase()}`
    },
    {
      title: 'Customer',
      dataIndex: 'user',
      render: (user) => user?.fullName || 'Guest'
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      render: (amount) => `₦${amount.toLocaleString()}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        const statusMap = {
          pending: { color: 'orange', text: 'Pending' },
          processing: { color: 'blue', text: 'Processing' },
          completed: { color: 'green', text: 'Completed' },
          cancelled: { color: 'red', text: 'Cancelled' }
        };
        return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
      }
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/admin/orders/${record._id}`)}>
          View Details
        </Button>
      )
    }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams({
          page: pagination.current,
          limit: pagination.pageSize,
          status: filters.status,
          search: filters.search
        }).toString();

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/orders?${query}`,
          {
          headers: { 'Authorization': `Bearer ${token}` }
        }
        );
        const data = await response.json();
        console.log(data);
        
        setOrders(data.data);
        setPagination({ ...pagination, total: data.total });
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pagination.current, filters, token]);

  return (
    <DashboardLayout title="Orders Management">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search orders..."
            prefix={<SearchOutlined />}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Select
            placeholder="Filter by status"
            options={statusOptions}
            onChange={(value) => setFilters({ ...filters, status: value })}
            allowClear
            style={{ width: 200 }}
          />
          <Button icon={<FilterOutlined />}>More Filters</Button>
        </div>

        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          loading={loading}
          pagination={pagination}
          onChange={(newPagination) => setPagination(newPagination)}
        />
      </div>
    </DashboardLayout>
  );
};

export default Orders;