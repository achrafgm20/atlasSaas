import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const loadFavorites = () => {
    const data = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(data);
  };

  useEffect(() => {
    loadFavorites();
    window.addEventListener('storage_updated', loadFavorites);
    return () => window.removeEventListener('storage_updated', loadFavorites);
  }, []);

  return (
    <div className="flex items-center gap-3 mb-2">
      {favorites.length === 0 ? (
        <div className="flex flex-col justify-center w-full h-full">
          <div className="text-center py-10 text-gray-400 items-center">
            <Heart size={48} className="mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-600">No favorites yet</h2>
            <p className="text-sm">Browse products and add them to your favorites!</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-md font-medium"
            >
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {favorites.map(item => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;