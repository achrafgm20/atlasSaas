import { useState, useEffect } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { moneyDhForma } from '@/lib/utils';
import { BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
interface Product {
  _id: string;
  productName: string;
  images: { url: string }[];
  storage: string;
  color: string;
  condition: string;
  listingPrice: number;
  battery: string;
  seller:{_id: number, name: string}
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const gradeClass = 
    product.condition === "Brand New" ? "bg-yellow-400 text-white" :
    product.condition === "Grade A"     ? "bg-green-500 text-white" :
    product.condition === "Grade B"     ? "bg-blue-400 text-black" :
    product.condition === "Fair"       ? "bg-gray-500 text-white" :
    "bg-gray-200 text-black"; // default 


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
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
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
    <Link to={`/${product._id}`} className="group"> 
    <div className="group bg-white rounded-[24px] overflow-hidden border shadow-blue-500 shadow-sm h hover:shadow-md  duration-300">
      <div className="relative h-72 bg-gray-50">
       
        <img 
          src={product.images && product.images.length > 0 ? product.images?.[0]?.url  : ''} 
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
        <div>
          <span className='absolute top-4 left-3'>
                <p className={` capitalize px-3 py-1 rounded-full font-semibold ${gradeClass}`}>{product.condition}</p>
            </span>
        </div>
      </div>

      <div className="p-5 space-y-3">
       
        <h3 className="font-bold text-[#1E3A8A] line-clamp-1">{product.productName}</h3>
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
           <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
            <p className='text-gray-400'>Store:</p>
            <h2 className='font-semibold'>{product.seller.name}</h2>
            <BadgeCheck className='text-blue-700' />
           </div>
        

        <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
          <div className="flex flex-col">
           
            <span className="text-2sm font-black text-[#60a5fa]">{moneyDhForma(product.listingPrice)}</span>
          </div>
          <button onClick={addToCart} className="flex cursor-pointer items-center gap-2 bg-linear-to-r from-[#3b82f6] to-[#2563eb] text-white px-7 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-blue-200">
                 <ShoppingCart size={18} />
                 <span>Add</span>
          </button>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default ProductCard;