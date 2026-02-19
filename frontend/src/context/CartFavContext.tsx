import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Define types
interface CartProduct {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    [key: string]: any;
  };
  quantity: number;
}

interface Cart {
  _id: string;
  user: string;
  products: CartProduct[];
  [key: string]: any;
}

interface CartResponse {
  cart: Cart;
  total: number;
}

interface CartContextType {
  cart: Cart | null;
  total: number;
  loading: boolean;
  error: string | null;
  getCart: () => Promise<CartResponse | null>;
  addToCart: (productId: number) => Promise<CartResponse | null>;
  deleteFromCart: (productId: number) => Promise<CartResponse | null>;
  clearCart: () => Promise<{ message: string } | null>;
  getCartItemCount: () => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:4000/api/cart';

  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  const getHeaders = (): Record<string, string> => {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const getCart = async (): Promise<CartResponse | null> => {
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
        if (response.status === 404) {
          setCart(null);
          setTotal(0);
          return null;
        }
        throw new Error(`Failed to fetch cart: ${response.status}`);
      }

      const data: CartResponse = await response.json();
      setCart(data.cart);
      setTotal(data.total);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error fetching cart:', err);
      setCart(null);
      setTotal(0);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number): Promise<CartResponse | null> => {
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

      const data: CartResponse = await response.json();
      setCart(data.cart);
      await getCart();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error adding to cart:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteFromCart = async (productId: number): Promise<CartResponse | null> => {
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

      const data: CartResponse = await response.json();
      setCart(data.cart);
      await getCart();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error deleting from cart:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async (): Promise<{ message: string } | null> => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        setError('Please login to manage cart');
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
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Error clearing cart:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getCartItemCount = (): number => {
    return cart?.products?.length || 0;
  };

  const isInCart = (productId: string): boolean => {
    return cart?.products?.some((item) => item.product._id === productId) || false;
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      getCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: CartContextType = {
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

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};