import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import axios from "axios";

interface ApiOrder {
  _id: string;
  buyer: {
    name: string;
  };
  billingAddress: {
    line1: string;
    city: string;
    postal_code: string;
    country: string;
  };
  items: {
    productId: string;
    productName: string;
    price: number;
  }[];
  totalAmount: number;
  createdAt: string;
}

const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/orders/SellersOrders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(res.data.orders || res.data);
      } catch (err) {
        console.error("Fetch orders error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading orders...
      </div>
    );
  }
console.log(orders)
  return (
    <div className="min-h-screen bg-gray-50 p-8 rounded-xl">
      <div className="max-w-8xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Manage and track all your orders</p>
        </div>

        <div className="bg-white rounded-lg shadow">

          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">All Orders</span>
            </div>
          </div>

          {orders.length === 0 ? (
            <p className="p-6 text-center text-gray-500">
              No orders found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{order._id.slice(-6)}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.items.map(item => (
                          <div key={item.productId}>
                            {item.productName}
                          </div>
                        ))}
                      </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                        {order.billingAddress?.line1} {order.billingAddress?.city} {order.billingAddress?.postal_code} {order.billingAddress?.country}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.buyer.name}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                        {order.totalAmount} $
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
