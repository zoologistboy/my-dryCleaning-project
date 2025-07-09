// src/components/RecentOrdersTable.jsx
import React from 'react';

export default function RecentOrdersTable({ orders }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-left">Order ID</th>
            <th className="text-left">Customer</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.customer}</td>
              <td>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}