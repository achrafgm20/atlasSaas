/* eslint-disable react-refresh/only-export-components */

import  { useState, useEffect, useRef } from 'react';
import {  Loader2, Edit, Check } from 'lucide-react';


export const allowedStatuses = ["pending", "paid",  "delivered",] as const;
export type OrderStatus = typeof allowedStatuses[number];

interface Buyer {
  _id: string;
  name: string;
  email: string;
}

interface Seller {
  _id: string;
  name: string;
  email: string;
}

interface OrderItem {
  price: number;
  productId: string;
  productName: string;
  sellerId: Seller;
  stripeAccountId: string;
}

export interface Order {
  _id: string;
  buyer: Buyer;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  status: OrderStatus;
  stripeSessionId: string;
  totalAmount: number;
  __v: number;
}

const OrdersAdmin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [activeStatusEditId, setActiveStatusEditId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLTableDataCellElement>(null);

  /* 
    🚨 Replace this with your actual auth logic!
    Only users with role === "Admin" can edit order status
  */
  const isAdmin = true; // Example: const isAdmin = currentUser?.role === "Admin"

  // Auto close status dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveStatusEditId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  // --------------------------
  // GET API: Fetch All Orders for Admin
  // --------------------------
  const fetchAllOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/orders/AllOrderAdmin', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error(res.status === 403 ? "You are not authorized to view orders" : "Failed to load orders");
      const data: { message: string, orders: Order[] } = await res.json();
      setOrders(data.orders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // --------------------------
  // PATCH API: Admin Update Order Status
  // --------------------------
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    setError(null);

    // Save old status to revert if API request fails
    const oldStatus = orders.find(o => o._id === orderId)?.status;

    // ✅ Optimistic UI Update: update UI instantly for better UX
    setOrders(prev => prev.map(order => 
      order._id === orderId ? {...order, status: newStatus} : order
    ))
    setActiveStatusEditId(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/orders/editOrderStatus/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        // Request body matches your specification
        body: JSON.stringify({ status: newStatus })
      })

      if (!res.ok) {
        throw new Error(res.status === 403 ? "Only admins can update order status" : "Failed to update status");
      }
      // Optional: add react-toastify here to show success notification

    } catch (err) {
      // ❌ Revert back to original status if request fails
      if (oldStatus) {
        setOrders(prev => prev.map(order => 
          order._id === orderId ? {...order, status: oldStatus} : order
        ))
      }
      setError(err instanceof Error ? err.message : "Failed to update status");
      console.error(err);
    } finally {
      setUpdatingOrderId(null);
    }
  }

  // --------------------------
  // Helper Functions
  // --------------------------
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'paid': return 'bg-blue-100 text-blue-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  const formatStatusText = (status: OrderStatus) => status.charAt(0).toUpperCase() + status.slice(1);
  const formatOrderId = (id: string) => `#ORD-${id.slice(-4).toUpperCase()}`;

  // Auto calculating stats, updates automatically when status changes
  const totalOrders = orders.length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const paidCount = orders.filter(o => o.status === 'paid').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  const stats = [
    { label: 'Total Orders', value: totalOrders, sub: '+23% this month', color: 'text-slate-900' },
    { label: 'Pending', value: pendingCount, sub: '', color: 'text-orange-500' },
    { label: 'paid', value: paidCount, sub: '', color: 'text-blue-600' },
    { label: 'Delivered', value: deliveredCount, sub: '', color: 'text-green-600' },
  ]

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen font-sans text-slate-700">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Orders Management</h1>
        <p className="text-sm text-slate-500">Monitor and manage all platform orders</p>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>
              {isLoading ? '-' : stat.value}
            </p>
            {stat.sub && <p className="text-xs text-green-600 mt-1">{stat.sub}</p>}
          </div>
        ))}
      </div>

      

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-slate-800">All Platform Orders</h2>
          <p className="text-xs text-slate-500">Showing {isLoading ? '...' : orders.length} orders</p>
          
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-12 text-gray-500 gap-2">
              <Loader2 className="animate-spin w-5 h-5" />
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No orders found</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-250">
              <thead>
                <tr className="bg-gray-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-gray-200">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Buyer</th>
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {orders.map((order) => {
                  const firstItem = order.items.at(0);
                  const isEditingStatus = activeStatusEditId === order._id;
                  const isUpdating = updatingOrderId === order._id;

                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-blue-600 cursor-pointer">
                        {formatOrderId(order._id)}
                      </td>
                      <td className="px-6 py-4 text-slate-700">{order.buyer.name}</td>
                      <td className="px-6 py-4 text-slate-600">{firstItem?.sellerId.name ?? 'Unknown Vendor'}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {firstItem?.productName ?? 'Unknown Product'}
                        {order.items.length > 1 && <span className="text-xs text-slate-400 ml-1">(+{order.items.length - 1} items)</span>}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-800">
                        ${order.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </td>
                      <td className="px-6 py-4 text-center relative" ref={isEditingStatus ? dropdownRef : undefined}>
                        {isUpdating ? (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                          </span>
                        ) : isEditingStatus ? (
                          <div className="absolute z-10 right-0 left-0 mx-auto w-40 bg-white shadow-lg rounded-lg border border-gray-200 py-1 text-left">
                            {allowedStatuses.map(statusOption => (
                              <button
                                key={statusOption}
                                onClick={() => updateOrderStatus(order._id, statusOption)}
                                className="w-full px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center justify-between"
                              >
                                <span>{formatStatusText(statusOption)}</span>
                                {order.status === statusOption && <Check className="w-3 h-3 text-green-600" />}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button
                            disabled={!isAdmin}
                            onClick={() => isAdmin && setActiveStatusEditId(order._id)}
                            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${getStatusStyle(order.status)} ${isAdmin ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                            title={isAdmin ? "Click to update status" : ""}
                          >
                            <span className="flex items-center gap-1 justify-center">
                              {formatStatusText(order.status)}
                              {isAdmin && <Edit className="w-3 h-3 opacity-70" />}
                            </span>
                          </button>
                        )}

                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrdersAdmin;