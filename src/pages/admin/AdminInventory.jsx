// src/pages/admin/Inventory.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Table, Tag, Input, Button, Space, Modal, Form, InputNumber } from 'antd';
import { SearchOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import DashboardLayout from '../../components/DashboardLayout';
import { AuthContext } from '../../contexts/AuthContext';

const Inventory = () => {
  const { token } = useContext(AuthContext)
  const [inventory, setInventory] = useState([]);//visible
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: 'Current Stock',
      dataIndex: 'currentStock',
      key: 'stock',
      render: (stock, record) => (
        <Tag color={stock < record.threshold ? 'red' : 'green'}>
          {stock} {record.unit}
        </Tag>
      )
    },
    {
      title: 'Threshold',
      dataIndex: 'threshold',
      key: 'threshold',
      render: (threshold, record) => `${threshold} ${record.unit}`
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `₦${price.toLocaleString()}`
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link">Edit</Button>
          <Button type="link" danger onClick={() => showDeleteConfirm(record._id)}>
            Delete
          </Button>
        </Space>
      )
    }
  ];

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: 'Confirm Delete',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this item?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(id);
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/inventory/${id}`, {
        method: 'DELETE'
      });
      fetchInventory();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ search: searchTerm }).toString();
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/inventory?${query}`);
      const data = await response.json();
      console.log(data);
      
      setInventory(data.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (values) => {
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          "Authorization":`Bearer ${token}`
         },
        body: JSON.stringify(values)
      });
      setIsModalVisible(false);
      form.resetFields();
      fetchInventory();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [searchTerm]);

  return (
    <DashboardLayout title="Inventory Management">
      <div className="space-y-4">
        <div className="flex justify-between">
          <Input
            placeholder="Search inventory..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Add Item
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={inventory}
          rowKey="_id"
          loading={loading}
        />

        <Modal
          title="Add New Inventory Item"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleAddItem}>
            <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="currentStock" label="Initial Stock" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="threshold" label="Low Stock Threshold" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
              <Input placeholder="e.g., kg, pieces, liters" />
            </Form.Item>
            <Form.Item name="price" label="Price (₦)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Item
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;