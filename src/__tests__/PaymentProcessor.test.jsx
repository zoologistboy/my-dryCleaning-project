import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentProcessor from '../../src/components/PaymentProcessor';
import { useFlutterwave } from 'flutterwave-react-v3';

jest.mock('flutterwave-react-v3', () => ({
  useFlutterwave: jest.fn(() => jest.fn())
}));

test('initiates payment on button click', () => {
  const mockOrder = {
    _id: '123',
    totalAmount: 5000,
    user: { email: 'test@example.com', fullName: 'Test User' }
  };

  render(<PaymentProcessor order={mockOrder} />);
  fireEvent.click(screen.getByText('Pay with Flutterwave'));
  expect(useFlutterwave).toHaveBeenCalled();
});