import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../pages/admin/Dashboard';
import { SocketProvider } from '../contexts/SocketContext';

// Mock API responses
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        totalOrders: 42,
        monthlyRevenue: 1250000,
        activeUsers: 78,
        lowStockCount: 3,
        // revenueData: [...]
      }),
    })
  );
});

test('renders dashboard stats correctly', async () => {
  render(
    <SocketProvider>
      <Dashboard />
    </SocketProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('₦1,250,000')).toBeInTheDocument();
  });
});

test('handles socket updates', async () => {
  const mockSocket = {
    on: jest.fn(),
    off: jest.fn(),
  };

  render(
    <SocketContext.Provider value={mockSocket}>
      <Dashboard />
    </SocketContext.Provider>
  );

  expect(mockSocket.on).toHaveBeenCalledWith('order_update', expect.any(Function));
});