import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface Order {
  id: string;
  product: {
    name: string;
    icon: string;
  };
  buyer: {
    name: string;
    avatar: string;
  };
  address: string;
  date: string;
  amount: string;
}

const OrdersTable: React.FC = () => {
  const orders: Order[] = [
    {
      id: 'ORD-1001',
      product: { name: 'iPhone 15 Pro Max', icon: '📱' },
      buyer: { name: 'John Smith', avatar: '👤' },
      address: '123 Main St, New York, NY 10001',
      date: '22/12/2024',
      amount: '$1198'
    },
    {
      id: 'ORD-1002',
      product: { name: 'MacBook Pro M3 16"', icon: '💻' },
      buyer: { name: 'Sarah Johnson', avatar: '👤' },
      address: '456 Oak Ave, Los Angeles, CA 90012',
      date: '22/12/2024',
      amount: '$2499'
    },
    {
      id: 'ORD-1003',
      product: { name: 'Samsung Galaxy S24 Ultra', icon: '📱' },
      buyer: { name: 'Michael Chen', avatar: '👤' },
      address: '789 Pine Rd, San Francisco, CA 94102',
      date: '21/12/2024',
      amount: '$1299'
    },
    {
      id: 'ORD-1004',
      product: { name: 'MacBook Pro M3 16"', icon: '💻' },
      buyer: { name: 'Emily Davis', avatar: '👤' },
      address: '321 Elm St, Chicago, IL 60601',
      date: '21/12/2024',
      amount: '$2499'
    },
    {
      id: 'ORD-1005',
      product: { name: 'Google Pixel 8 Pro', icon: '📱' },
      buyer: { name: 'David Wilson', avatar: '👤' },
      address: '654 Maple Dr, Austin, TX 78701',
      date: '20/12/2024',
      amount: '$999'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 rounded-xl">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Manage and track all your orders</p>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-lg shadow">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">All Orders</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-xl">
                          {order.product.icon}
                        </div>
                        <span className="text-sm text-gray-900">{order.product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          {order.buyer.avatar}
                        </div>
                        <span className="text-sm text-gray-900">{order.buyer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                      {order.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;