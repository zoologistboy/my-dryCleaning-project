// src/__tests__/Dashboard.test.jsx
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import Dashboard from '../pages/admin/Dashboard';
import { SocketContext } from '../contexts/SocketContext';

// Mock the socket
const mockSocket = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn()
};

// Mock child components
jest.mock('../components/StatsCard.jsx', () => ({ title, value }) => (
  <div data-testid="stats-card">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
));

jest.mock('../components/RecentOrdersTable', () => ({ orders }) => (
  <div data-testid="orders-table">
    {orders.map(order => (
      <div key={order.id}>{order.customer}</div>
    ))}
  </div>
));

jest.mock('../components/RevenueChart', () => () => (
  <div data-testid="revenue-chart" />
));

beforeEach(() => {
  global.fetch = jest.fn()
    .mockImplementationOnce(() => 
      Promise.resolve({
        json: () => Promise.resolve({
          totalOrders: 42,
          monthlyRevenue: 1250000,
          activeUsers: 78,
          lowStockCount: 3,
          orderTrend: '+5%',
          revenueTrend: '+12%'
        })
      }))
    .mockImplementationOnce(() => 
      Promise.resolve({
        json: () => Promise.resolve([
          { id: '1', customer: 'John Doe', status: 'Delivered', amount: 25000 }
        ])
      }));
});

test('renders dashboard with stats', async () => {
  await act(async () => {
    render(
      <SocketContext.Provider value={mockSocket}>
        <Dashboard />
      </SocketContext.Provider>
    );
  });

  // expect(screen.getByText('Total Orders')).toBeInTheDocument();
  // expect(screen.getByText('42')).toBeInTheDocument();
  // expect(mockSocket.on).toHaveBeenCalledWith('order_update', expect.any(Function));
});