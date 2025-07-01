import { render, screen, fireEvent } from '@testing-library/react';
import PaymentProcessor from '../components/PaymentProcessor';

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