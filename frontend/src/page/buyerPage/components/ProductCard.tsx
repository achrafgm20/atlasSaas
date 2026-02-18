
import { ShoppingCart, Heart, BadgeCheck } from 'lucide-react';
import { moneyDhForma } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartFavContext';
import { useFavorite } from '@/context/FavoriteContext';

interface Product {
  _id: string;
  productName: string;
  images: { url: string }[];
  storage: string;
  color: string;
  condition: string;
  listingPrice: number;
  battery: string;
  seller: { _id: number; name: string };
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToFavorites, deleteFromFavorites, isFavorite } = useFavorite();

  const gradeClass =
    product.condition === 'Brand New'
      ? 'bg-yellow-400 text-white'
      : product.condition === 'Grade A'
      ? 'bg-green-500 text-white'
      : product.condition === 'Grade B'
      ? 'bg-blue-400 text-black'
      : product.condition === 'Fair'
      ? 'bg-gray-500 text-white'
      : 'bg-gray-200 text-black';

  const isProductFavorite = isFavorite(product._id);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProductFavorite) {
      await deleteFromFavorites(product._id);
    } else {
      await addToFavorites(product._id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(product._id);
    addToCart(product._id as any);
  };

  return (
    <Link to={`/${product._id}`} className="group">
      <div className="bg-white rounded-[24px] overflow-hidden border shadow-sm hover:shadow-md duration-300">
        {/* Image */}
        <div className="relative h-72 bg-gray-50">
          <img
            src={product.images?.[0]?.url || ''}
            alt={product.productName}
            className="w-full h-full object-cover"
          />

          {/* Favorite */}
          <button
            onClick={toggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition ${
              isProductFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-400'
            }`}
          >
            <Heart size={18} className={isProductFavorite ? 'fill-current' : ''} />
          </button>

          {/* Condition */}
          <span className="absolute top-4 left-3">
            <p className={`px-3 py-1 rounded-full font-semibold ${gradeClass}`}>
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

          {/* Seller */}
          <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
            <p className="text-gray-400">Store:</p>
            <h2 className="font-semibold">{product.seller.name}</h2>
            <BadgeCheck className="text-blue-700" />
          </div>

          {/* Price & Add to cart */}
          <div className="border-t flex-col xl:flex-row border-gray-100 pt-3 flex items-center justify-between">
            <span className="font-black text-[#60a5fa]">
              {moneyDhForma(product.listingPrice)}
            </span>

            <button
              onClick={handleAddToCart}
              className="flex my-2 cursor-pointer items-center gap-2 bg-linear-to-r from-[#3b82f6] to-[#2563eb] text-white px-7 py-2.5 rounded-md font-bold text-sm shadow-lg shadow-blue-200"
            >
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