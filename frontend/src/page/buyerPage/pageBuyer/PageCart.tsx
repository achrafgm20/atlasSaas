
import { Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartFavContext';
import { moneyDhForma } from '@/lib/utils';

const Cart = () => {
  const { cart, total, loading, deleteFromCart, clearCart, getCartItemCount } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleRemoveItem = async (productId : PRODUCT) => {
    await deleteFromCart(productId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const cartItemCount = getCartItemCount();

  if (loading && !cart) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cartItemCount === 0) {
    return (
      <div>
        <div>
          <h1 className="text-3xl font-bold mx-7 my-5">Shopping Cart</h1>
          <p className="text-gray-500 mx-7 my-5">0 items in your cart</p>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-11">
          <div className="bg-gray-100 p-8 rounded-3xl">
            <ShoppingBag size={50} className="text-gray-300" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
            <p className="text-gray-500">Add some products to get started!</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-[#1E3A8A] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-900 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const subtotal = total || 0;

  const totalAmount = subtotal ;

  const handleCheckout = async () => {
  try {
    

    const response = await fetch(
      "http://localhost:4000/api/checkout/createSession",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    window.location.href = data.url;
    console.log(data)

  } catch (error) {
    console.error("Checkout error:", error);
  }
};

  return (
    <div className="max-w-6xl h-auto mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
      <p className="text-gray-500 mb-8">{cartItemCount} items in your cart</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.products.map((item ) => (
            <div key={item._id} className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-36 h-36 bg-gray-50 rounded-xl overflow-hidden">
                {item.product.images && item.product.images.length > 0 ? (
                  <img 
                    src={item.product.images[0].url} 
                    alt={item.product.productName} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <ShoppingBag size={32} className="text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.product.productName}</h3>
                <div className="text-sm text-gray-400">
                  {item.product.storage && (
                    <p>Storage: <span className="text-black font-semibold">{item.product.storage}</span></p>
                  )}
                  {item.product.color && (
                    <p>Color: <span className="text-black font-semibold">{item.product.color}</span></p>
                  )}
                  {item.product.condition && (
                    <p>Condition: <span className="text-green-600 font-semibold">{item.product.condition}</span></p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-[#059669]">{moneyDhForma(item.product.listingPrice)}</span>
                <button 
                  onClick={() => handleRemoveItem(item.product._id)}
                  disabled={loading}
                  className="text-gray-300 cursor-pointer hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          <button 
            onClick={handleClearCart}
            disabled={loading}
            className="w-full cursor-pointer  py-3 border-2 border-red-100 text-red-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={18} /> Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="font-bold text-black">{moneyDhForma(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span className="font-bold text-green-500">FREE</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total</span>
              <span className="text-[#1E3A8A]">{moneyDhForma(totalAmount)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full cursor-pointer bg-[#1E3A8A] text-white py-4 rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-lg shadow-blue-100"
              disabled={loading}
            >
              Proceed to Checkout
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full cursor-pointer py-4 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;