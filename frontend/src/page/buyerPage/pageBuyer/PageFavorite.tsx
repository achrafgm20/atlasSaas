import React, { useState, useEffect } from 'react';
import { ChevronLeft, Heart } from 'lucide-react';
import Favorites from "../components/Favorites";
import { useNavigate } from 'react-router-dom';

const PageFavorite = () => {
  const [CountFav, setCountFav] = useState(0);
  const navigate = useNavigate();

  const updateCount = () => {
    const data = JSON.parse(localStorage.getItem('favorites') || '[]');
    setCountFav(data.length);
  };

  useEffect(() => {
    updateCount();
    window.addEventListener('storage_updated', updateCount);
    return () => window.removeEventListener('storage_updated', updateCount);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-[#E0E7FF] text-[#2563eb] px-4 py-2 rounded-lg font-bold text-sm mb-8 hover:bg-blue-100 transition-all shadow-sm"
        >
          <ChevronLeft size={18} />
          Back to Home
        </button>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <Heart className="text-red-500 fill-red-500" size={32} />
            <h1 className="text-3xl font-black text-[#1E3A8A]">My Favorites</h1>
          </div>
          <p className="text-gray-500">{CountFav} items saved</p>
        </div>

        <Favorites />
      </div>
    </div>
  );
};

export default PageFavorite;