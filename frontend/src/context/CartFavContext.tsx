import { createContext, useContext, useState, useEffect } from 'react';


const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  const API_BASE_URL = 'http://localhost:4000/api/cart';

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Get headers with token
  const getHeaders = () => {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  };

  // Get cart
  const getCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/getCart`, {
        method: 'GET',
        credentials: 'include',
        headers: getHeaders(),
      });

      if (!response.ok) {
        // If cart doesn't exist (404), initialize empty cart
        if (response.status === 404) {
          setCart(null);
          setTotal(0);
          return null;
        }
        throw new Error(`Failed to fetch cart: ${response.status}`);
      }

      const data = await response.json();
      setCart(data.cart);
      setTotal(data.total);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cart:', err);
      setCart(null);
      setTotal(0);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add product to cart
  const addToCart = async (productId :number) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        setError('Please login to add items to cart');
        setLoading(false);
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/addCard`, {
        method: 'POST',
        credentials: 'include',
        headers: getHeaders(),
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add product to cart');
      }

      const data = await response.json();
      setCart(data.cart);
      // Recalculate total
      await getCart();
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error adding to cart:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete product from cart
  const deleteFromCart = async (productId :number) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        setError('Please login to manage cart');
        setLoading(false);
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/deleteProductCart/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete product from cart');
      }

      const data = await response.json();
      setCart(data.cart);
      // Recalculate total
      await getCart();
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting from cart:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        setError("Please login to manage cart");
        setLoading(false);
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/clearCart`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to clear cart');
      }

      const data = await response.json();
      setCart(null);
      setTotal(0);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error clearing cart:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart?.products?.length || 0;
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return cart?.products?.some(item => item.product._id === productId) || false;
  };

  // Load cart on mount only if token exists
  useEffect(() => {
    const token = getToken();
    if (token) {
      getCart();
    }
  }, []);

  const value = {
    cart,
    total,
    loading,
    error,
    getCart,
    addToCart,
    deleteFromCart,
    clearCart,
    getCartItemCount,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};