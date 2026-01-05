import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some(fav => fav._id === product._id));
  }, [product._id]);

  const toggleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      favorites = favorites.filter(fav => fav._id !== product._id);
    } else {
      favorites.push(product);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event('storage_updated'));
  };

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart_updated')); 
  };

  return (
    <div className="group bg-white rounded-[24px] overflow-hidden border shadow-blue-500 shadow-sm hover:scale-105 hover:shadow-xl duration-300">
      <div className="relative h-48 bg-gray-50">
       
        <img 
          src={product.images && product.images.length > 0 ? `http://localhost:5000${product.images[0].url}` : ''} 
          alt={product.productName} 
          className="w-full h-full object-cover" 
        />
        <button 
          onClick={toggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all shadow-md ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-400'
          }`}
        >
          <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
        </button>
      </div>

      <div className="p-5 space-y-3">
       
        <h3 className="font-bold text-[#1E3A8A] line-clamp-1">{product.productName}</h3>
        <div className="space-y-1 text-[13px]">
          <div className="flex justify-between">
            <span className="text-gray-400 font-medium">Storage</span>
            <span className="font-bold">{product.storage}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 font-medium">Color</span>
            <span className="font-bold">{product.color}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[13px] font-bold">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
  
          <span>{product.condition}</span> 
        </div>

        <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
          <div className="flex flex-col">
           
            <span className="text-2sm font-black text-[#60a5fa]">${product.listingPrice}</span>
          </div>
          <button onClick={addToCart} className="flex items-center gap-2 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white px-7 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-blue-200">
                 <ShoppingCart size={18} />
                 <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;