

import { useState } from 'react';
import { Package, Calendar, CreditCard, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

function PageOrder() {
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Demo orders data - replace with actual paid orders from your API/context
  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-20',
      total: 299.97,
      items: [
        { id: 1, name: 'Wireless Headphones', price: 99.99, quantity: 2, image: 'https://via.placeholder.com/80' },
        { id: 2, name: 'Phone Case', price: 49.99, quantity: 2, image: 'https://via.placeholder.com/80' }
      ],
      payment: {
        method: 'Credit Card',
        last4: '4242',
        transactionId: 'TXN-123456789',
        date: '2024-01-20 14:32:15'
      }
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-18',
      total: 149.99,
      items: [
        { id: 3, name: 'Smartwatch', price: 149.99, quantity: 1, image: 'https://via.placeholder.com/80' }
      ],
      payment: {
        method: 'PayPal',
        last4: 'N/A',
        transactionId: 'TXN-987654321',
        date: '2024-01-18 10:15:42'
      }
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-15',
      total: 79.98,
      items: [
        { id: 4, name: 'USB Cable', price: 19.99, quantity: 2, image: 'https://via.placeholder.com/80' },
        { id: 5, name: 'Screen Protector', price: 39.99, quantity: 1, image: 'https://via.placeholder.com/80' }
      ],
      payment: {
        method: 'Credit Card',
        last4: '5555',
        transactionId: 'TXN-456789123',
        date: '2024-01-15 16:45:30'
      }
    }
  ];

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h1>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Orders Yet</h2>
            <p className="text-gray-500">You haven't placed any orders. Start shopping to see your orders here!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <p className="text-gray-600 mt-2">View your completed purchases</p>
        </div>
        
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleOrder(order.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">{order.id}</h3>
                      <span className="px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 bg-green-100 text-green-800">
                        <CheckCircle size={18} />
                        Payment Completed
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package size={16} />
                        <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Paid</p>
                      <p className="text-2xl font-bold text-green-600">${order.total.toFixed(2)}</p>
                    </div>
                    
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      {expandedOrder === order.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Details (Expanded) */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Items - Takes 2 columns */}
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Package size={20} />
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex gap-3 bg-white p-4 rounded-lg shadow-sm">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800 mb-1">{item.name}</h5>
                              <p className="text-sm text-gray-600 mb-2">Quantity: {item.quantity}</p>
                              <p className="text-lg font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                              <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                            </div>
                          </div>
                        ))}
                        
                        {/* Order Summary */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border-t-2 border-green-500">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="font-semibold">${order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                              <span>Total Paid:</span>
                              <span className="text-green-600">${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info - Takes 1 column */}
                    <div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <CreditCard size={20} />
                          Payment Details
                        </h4>
                        
                        <div className="space-y-3">
                          <div className="pb-3 border-b">
                            <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {order.payment.method}
                              {order.payment.last4 !== 'N/A' && ` •••• ${order.payment.last4}`}
                            </p>
                          </div>
                          
                          <div className="pb-3 border-b">
                            <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                            <p className="text-sm font-mono text-gray-700">{order.payment.transactionId}</p>
                          </div>
                          
                          <div className="pb-3 border-b">
                            <p className="text-xs text-gray-500 mb-1">Payment Date</p>
                            <p className="text-sm text-gray-700">{order.payment.date}</p>
                          </div>
                          
                          <div className="pt-2">
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle size={20} />
                              <span className="font-semibold">Payment Successful</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PageOrder;