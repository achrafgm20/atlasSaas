// FavoriteContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface FavoriteContextType {
  favorites: any[];
  loading: boolean;
  error: string | null;
  getFavorites: () => Promise<void>;
  addToFavorites: (productId: string) => Promise<any>;
  deleteFromFavorites: (productId: string) => Promise<any>;
  isFavorite: (productId: string) => boolean;
  getFavoriteCount: () => number;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorite must be used within a FavoriteProvider');
  }
  return context;
};

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:4000/api/favorite';

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const getHeaders = () => {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const getFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        setFavorites([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/getFavorite`, {
        method: 'GET',
        credentials: 'include',
        headers: getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          setFavorites([]);
          return;
        }
        throw new Error(`Failed to fetch favorites: ${response.status}`);
      }

      const data = await response.json();

      let favoritesArray: any[] = [];
      if (Array.isArray(data)) {
        favoritesArray = data;
      } else if (Array.isArray(data.favorites)) {
        favoritesArray = data.favorites;
      } else if (Array.isArray(data.products)) {
        favoritesArray = data.products;
      } else if (data.favorite && Array.isArray(data.favorite.products)) {
        favoritesArray = data.favorite.products;
      }

      setFavorites(favoritesArray);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching favorites:', err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        setError('Please login to add items to favorites');
        setLoading(false);
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/addFavorite`, {
        method: 'POST',
        credentials: 'include',
        headers: getHeaders(),
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add product to favorites');
      }

      const data = await response.json();
      await getFavorites();
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding to favorites:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteFromFavorites = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        setError('Please login to manage favorites');
        setLoading(false);
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/deleteFav/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete product from favorites');
      }

      const data = await response.json();
      await getFavorites();
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting from favorites:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (productId: string) => {
    if (!Array.isArray(favorites) || favorites.length === 0) {
      return false;
    }
    return favorites.some(
      (item) =>
        item._id === productId ||
        item.product?._id === productId ||
        item.productId === productId
    );
  };

  const getFavoriteCount = () => {
    return Array.isArray(favorites) ? favorites.length : 0;
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      getFavorites();
    }
  }, []);

  const value: FavoriteContextType = {
    favorites,
    loading,
    error,
    getFavorites,
    addToFavorites,
    deleteFromFavorites,
    isFavorite,
    getFavoriteCount,
  };

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
};