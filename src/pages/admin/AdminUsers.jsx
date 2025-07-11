// src/pages/admin/Users.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Table, Tag, Input, Button, Select, Space, Modal } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import DashboardLayout from '../../components/DashboardLayout';
import { AuthContext } from '../../contexts/AuthContext';

const Users = () => {
  const {token} = useContext(AuthContext)
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : role === 'staff' ? 'blue' : 'green'}>
          {role.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'status',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link">Edit</Button>
          <Button type="link" danger>
            {record.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </Space>
      )
    }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams({
          page: pagination.current,
          limit: pagination.pageSize,
          search: searchTerm,
          role: roleFilter
        }).toString();

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/users?${query}`,
          {
          headers:{"Authorization":`Bearer ${token}`}}
        );
        const data = await response.json();
        setUsers(data.data);
        setPagination({ ...pagination, total: data.total });
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [pagination.current, searchTerm, roleFilter, token]);

  return (
    <DashboardLayout title="Users Management">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by role"
            style={{ width: 150 }}
            onChange={(value) => setRoleFilter(value)}
            allowClear
            options={[
              { value: 'user', label: 'Customer' },
              { value: 'staff', label: 'Staff' },
              { value: 'admin', label: 'Admin' }
            ]}
          />
          <Button type="primary" icon={<UserAddOutlined />}>
            Add User
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
          pagination={pagination}
          onChange={(newPagination) => setPagination(newPagination)}
        />
      </div>
    </DashboardLayout>
  );
};

export default Users;