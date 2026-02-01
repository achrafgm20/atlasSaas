import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { X, Mail, MapPin, CreditCard } from "lucide-react"

interface BillingAddress {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: string;
}

interface ProductImage {
  public_id: string;
  url: string;
  _id: string;
}

interface ProductId {
  images: ProductImage[];
  _id: string;
}

interface OrderItem {
  price: number;
  productId: ProductId;
  productName: string;
  sellerId: string;
  stripeAccountId: string;
}

interface Order {
  _id: string;
  billingAddress: BillingAddress;
  buyer: string;
  createdAt: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: null | BillingAddress;
  status: string;
  stripePayementIntentIdf: string;
  stripeSessionId: string;
  totalAmount: number;
  updatedAt: string;
  __v: number;
}

interface OrderDetailProps {
  id: string;
}

export function OrderDetail({ id }: OrderDetailProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!id || !open) return;

    async function fetchOrder() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:4000/api/orders/getDetailsOrder/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        console.log("Fetched data:", data);
        setOrder(data.orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id, open]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">View Order Details</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl p-0 gap-0">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : error ? (
          <div className="p-8 text-red-500">Error: {error}</div>
        ) : order ? (
          <div className="bg-white">
            {/* Header */}
            <div className="border-b px-6 py-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">Order Details</h2>
                <p className="text-sm text-gray-500">Complete order information</p>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="hover:bg-gray-100 rounded p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Order Info Grid */}
            <div className="grid grid-cols-5 gap-4 px-6 py-5 bg-gray-50 border-b">
              <div>
                <p className="text-xs text-gray-500 mb-1">Order ID</p>
                <p className="font-semibold">ORD-{order._id.slice(-4)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Payment</p>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  <p className="font-medium">Credit Card</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                <p className="font-medium">TXN-{order.stripePayementIntentIdf.slice(-4)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Order Date</p>
                <p className="font-medium text-sm">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-cyan-500">${order.totalAmount}</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-2 gap-6 p-6">
              {/* Buyer Information */}
              <div>
                <h3 className="font-semibold mb-4">Buyer Information</h3>
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                      {order.customerEmail.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">Customer</p>
                      <p className="text-sm text-gray-500">Customer</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm">{order.customerEmail}</p>
                      </div>
                    </div>

                    

                    {order.billingAddress && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Shipping Address</p>
                          <p className="text-sm">
                            {order.billingAddress?.line1}, {order.billingAddress?.city}, {order.billingAddress?.country} {order.billingAddress?.postal_code}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Products in Order */}
              <div>
                <h3 className="font-semibold mb-4">Products in Order</h3>
                <div className="border rounded-lg">
                  <div className="grid grid-cols-2 gap-4 px-4 py-3 bg-gray-50 border-b text-xs font-medium text-gray-600">
                    <div>Product</div>
                    
                    <div className="text-right">Price</div>
                  </div>
                  {order.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 px-4 py-3 items-center">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.productId?.images?.[0]?.url || '/placeholder.png'} 
                          alt={item.productName}
                          className="w-12 h-12 object-cover rounded bg-gray-100"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.productName}</p>
                          <p className="text-xs text-gray-500">SKU: {item.productId?._id?.slice(-6) || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-cyan-500">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                Print Order
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">No order data available</div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}