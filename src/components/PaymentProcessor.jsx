import { useFlutterwave } from 'flutterwave-react-v3';

export default function PaymentProcessor({ order, onSuccess }) {
  const config = {
    public_key: process.env.REACT_APP_FLW_PUBLIC_KEY,
    tx_ref: `order_${order._id}_${Date.now()}`,
    amount: order.totalAmount,
    currency: 'NGN',
    payment_options: 'card',
    customer: {
      email: order.user.email,
      name: order.user.fullName,
    },
    customizations: {
      title: 'FreshPress Payment',
      description: `Payment for Order #${order._id}`,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <button
      onClick={() => {
        handleFlutterPayment({
          callback: (response) => {
            if (response.status === 'successful') {
              onSuccess(response);
            }
          },
          onClose: () => console.log('Payment closed'),
        });
      }}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Pay with Flutterwave
    </button>
  );
}