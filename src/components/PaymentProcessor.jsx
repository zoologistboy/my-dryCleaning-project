import { useFlutterwave } from 'flutterwave-react-v3';
import React from 'react';
import { VITE_BASE_URL } from '../config';


export default function PaymentProcessor({ order, onSuccess }) {
  const config = {
    public_key: "FLWPUBK_TEST-9df5304d2f0e1d8161e4ddfa4e1f4d63-X",
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