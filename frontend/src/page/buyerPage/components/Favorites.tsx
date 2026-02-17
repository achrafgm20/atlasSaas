
import React from 'react';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useFavorite } from '@/context/FavoriteContext';
import { useCart } from '@/context/CartFavContext';
import { moneyDhForma } from '@/lib/utils';
import { Link } from 'react-router-dom';


const Favorites = () => {
  const { favorites, loading, deleteFromFavorites } = useFavorite();
  const { addToCart } = useCart();

  const handleRemoveFavorite = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteFromFavorites(productId);
  };

  const handleAddToCart = async (productId: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(productId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Heart className="text-gray-300 mb-4" size={80} />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No favorites yet</h2>
        <p className="text-gray-500">Start adding products to your favorites!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {favorites.map((item) => {
        // Handle both direct product and nested product structures
        const product = item.product || item;
        
        return (
          <Link 
            to={`/${product._id}`} 
            key={product._id}
            className="group"
          >
            <div className="bg-white rounded-[24px] overflow-hidden border shadow-sm hover:shadow-md duration-300">
              {/* Image */}
              <div className="relative h-72 bg-gray-50">
                <img
                  src={product.images?.[0]?.url || ''}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />

                {/* Remove Button */}
                <button
                  onClick={(e) => handleRemoveFavorite(product._id, e)}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition"
                >
                  <Trash2 size={18} />
                </button>

                {/* Condition Badge */}
                <span className="absolute top-4 left-3">
                  <p className={`px-3 py-1 rounded-full font-semibold ${
                    product.condition === 'Brand New'
                      ? 'bg-yellow-400 text-white'
                      : product.condition === 'Grade A'
                      ? 'bg-green-500 text-white'
                      : product.condition === 'Grade B'
                      ? 'bg-blue-400 text-black'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {product.condition}
                  </p>
                </span>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-[#1E3A8A] line-clamp-1">
                  {product.productName}
                </h3>

                <div className="space-y-1 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Storage</span>
                    <span className="font-bold">{product.storage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Battery</span>
                    <span className="font-bold">{product.battery}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Color</span>
                    <span className="font-bold">{product.color}</span>
                  </div>
                </div>

                {/* Price & Add to cart */}
                <div className="border-t border-gray-100 pt-3 flex flex-col xl:flex-row items-center justify-between gap-2">
                  <span className="font-black text-[#60a5fa]">
                    {moneyDhForma(product.listingPrice)}
                  </span>

                  <button
                    onClick={(e) => handleAddToCart(product._id, e)}
                    className="flex cursor-pointer items-center gap-2 bg-linear-to-r from-[#3b82f6] to-[#2563eb] text-white px-7 py-2.5 rounded-md font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-xl transition"
                  >
                    <ShoppingCart size={18} />
                    <span>Add </span>
                  </button>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Favorites;