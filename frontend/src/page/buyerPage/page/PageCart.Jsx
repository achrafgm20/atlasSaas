import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(savedCart);
    };
    loadCart();
    window.addEventListener('cart_updated', loadCart);
    return () => window.removeEventListener('cart_updated', loadCart);
  }, []);

  const updateQuantity = (id, change) => {
    const newCart = cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cartItems.filter(item => item.id !== id);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const saveCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart_updated'));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div>
      <div>  <h1 className="text-3xl font-bold mx-7 my-5">Shopping Cart</h1>
      <p className="text-gray-500 mx-7 my-5">{cartItems.length} items in your cart</p>
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
      <p className="text-gray-500 mb-8">{cartItems.length} items in your cart</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des produits */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <div className="text-sm text-gray-400">
                  <p>Storage: <span className="text-black font-semibold">{item.storage}</span></p>
                  <p>Color: <span className="text-black font-semibold">{item.color}</span></p>
                  <p>Condition: <span className="text-green-600 font-semibold">{item.condition || 'Grade A'}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-blue-600"><Minus size={16}/></button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-blue-600"><Plus size={16}/></button>
                </div>
                <span className="text-xl font-bold text-[#059669]">${item.price}</span>
                <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          <button 
            onClick={clearCart}
            className="w-full py-3 border-2 border-red-100 text-red-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
          >
            <Trash2 size={18} /> Clear Cart
          </button>
        </div>

        {/* Résumé de la commande */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="font-bold text-black">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span className="font-bold text-green-500">FREE</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax (8%)</span>
              <span className="font-bold text-black">${tax.toFixed(2)}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total</span>
              <span className="text-[#1E3A8A]">${total.toFixed(2)}</span>
            </div>
            
            <button className="w-full bg-[#1E3A8A] text-white py-4 rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-lg shadow-blue-100">
              Proceed to Checkout
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all"
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