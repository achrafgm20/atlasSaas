import { useEffect, useState } from 'react';
import { Package, Calendar, CreditCard, CheckCircle, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import axios, { AxiosError } from 'axios';

// Type definitions
interface Seller {
  _id: string;
  name: string;
  email: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  sellerId: Seller;
}

interface Order {
  _id: string;
  items: OrderItem[];
  status: string;
  totalAmount: number;
  stripeSessionId: string;
  stripeAccountId?: string;
  createdAt: string;
  updatedAt: string;
  billingAddress: {
    line1: string;
    line2: string;
    city: string;
    postal_code: string;
    country: string;
  };  
  __v: number;
}

interface OrdersResponse {
  orders: Order[];
}

function PageOrder() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");
   
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get<OrdersResponse>(
          "http://localhost:4000/api/orders/BuyerSOrders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data.orders);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Fetch orders error:", err);
        const error = err as AxiosError;
        setError(error.message || "Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const toggleOrder = (orderId: string): void => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="mx-auto text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

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
          {orders.map((order: Order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleOrder(order._id)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
                        order.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        <CheckCircle size={18} />
                        {order.status === 'paid' ? 'Payment Completed' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{formatDate(order.createdAt)}</span>
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
                      <p className="text-2xl font-bold text-green-600">${order.totalAmount}</p>
                    </div>
                    
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      {expandedOrder === order._id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Details (Expanded) */}
              {expandedOrder === order._id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Items - Takes 2 columns */}
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Package size={20} />
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item: OrderItem, index: number) => (
                          <div key={index} className="flex gap-3 bg-white p-4 rounded-lg shadow-sm">
                            <div className="w-20 h-20 bg-linear-to-br from-blue-100 to-blue-200 rounded-md flex items-center justify-center">
                              <Package size={32} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800 mb-1">{item.productName}</h5>
                              <p className="text-sm text-gray-600 mb-2">Product ID: {item.productId}</p>
                              <p className="text-lg font-bold text-gray-800">${item.price}</p>
                              {item.sellerId && (
                                <div className="mt-2 text-xs text-gray-500">
                                  <p>Seller: {item.sellerId.name}</p>
                                  <p>{item.sellerId.email}</p>

                                  
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {/* Order Summary */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border-t-2 border-green-500">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="font-semibold">${order.totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                              <span>Total Paid:</span>
                              <span className="text-green-600">${order.totalAmount}</span>
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
                              Stripe Payment
                            </p>
                          </div>
                          
                          <div className="pb-3 border-b">
                            <p className="text-xs text-gray-500 mb-1">Adress Billing</p>
                            <p className="text-sm font-mono text-gray-700 break-all">
                              <p>{order.billingAddress?.city}</p>
                              <p>{order.billingAddress?.line1}</p>
                              <p>{order.billingAddress?.line2}</p>
                              <p>{order.billingAddress?.postal_code}</p>
                              <p>{order.billingAddress?.country}</p>
                            </p>
                          </div>
                          
                          {order.stripeAccountId && (
                            <div className="pb-3 border-b">
                              <p className="text-xs text-gray-500 mb-1">Stripe Account</p>
                              <p className="text-sm font-mono text-gray-700 break-all">
                                {order.stripeAccountId}
                              </p>
                            </div>
                          )}
                          
                          <div className="pb-3 border-b">
                            <p className="text-xs text-gray-500 mb-1">Payment Date</p>
                            <p className="text-sm text-gray-700">{formatDate(order.updatedAt)}</p>
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