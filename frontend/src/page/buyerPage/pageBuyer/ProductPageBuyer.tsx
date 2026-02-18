import { Button } from '@/components/ui/button';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { moneyDhForma } from '@/lib/utils';
import Policy from '../components/Policy';
import { useCart } from '@/context/CartFavContext';
import ChatApp from '../components/ChatApp';
import ProfilSeller from '../components/ProfilSeller';

// ─── Type Definitions ───────────────────────────────────

type ProductImage = { url: string } | string;

interface Seller {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  // add more fields as needed from your API
}

interface Product {
  _id: string;
  productName: string;
  description: string;
  category: string;
  condition: string;
  listingPrice: number;
  costPrice: number;
  status: string;
  images: ProductImage[];
  seller: Seller;
  storage: string;
  color: string;
  battery: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Helper: extract URL string from ProductImage ───────
const getImageUrl = (img: ProductImage): string => {
  return typeof img === 'string' ? img : img.url;
};

// ─── Component ──────────────────────────────────────────

export default function ProductPageBuyer() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean | null>(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // ✅ typed
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const getConditionStyles = (condition: string): string => {
    switch (condition) {
      case 'Brand New':
        return 'bg-yellow-400 text-yellow-950 border-yellow-500';
      case 'Grade A':
        return 'bg-green-500 text-white border-green-600';
      case 'Grade B':
        return 'bg-blue-500 text-white border-blue-600';
      case 'Fair':
        return 'bg-gray-600 text-white border-gray-700';
      default:
        return 'bg-white border-gray-200 text-gray-900';
    }
  };

 useEffect(() => {
  if (!id) return;

  let ignore = false; // ← cleanup flag to prevent updates on unmounted component

  async function fetchProduct() {
    try {
      const res = await axios.get<Product>(
        `http://localhost:4000/api/product/getProductDetails/${id}`
      );

      // ✅ All setState calls happen AFTER await (async context, not synchronous)
      if (!ignore) {
        setProduct(res.data);
        if (res.data.images?.length > 0) {
          setSelectedImage(getImageUrl(res.data.images[0]));
        }
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      if (!ignore) {
        setLoading(false);
      }
    }
  }

  fetchProduct();

  return () => {
    ignore = true; // ← cancel pending updates if id changes or component unmounts
  };
}, [id]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#e2edf7]">
        <div className="text-xl font-semibold text-blue-600">
          Loading product details...
        </div>
      </div>
    );
  }

  if (!product)
    return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="min-h-screen bg-[#e2edf7] px-4 py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col">
        {/* Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            className="gap-2 pl-0 hover:bg-transparent text-blue-700 hover:text-blue-900"
          >
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft size={20} /> Back to Home
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Column: Image Gallery */}
          <div className="flex h-fit w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-white bg-white p-6 shadow-sm lg:w-1/2">
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-gray-50">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.productName}
                  className="h-full w-full object-contain mix-blend-multiply"
                />
              ) : (
                <div className="text-gray-400">No Image Available</div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-4 overflow-x-auto py-2">
              {product.images?.map((img: ProductImage, index: number) => {
                const imgUrl: string = getImageUrl(img); // ✅ typed
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 bg-white transition-all ${
                      selectedImage === imgUrl
                        ? 'border-blue-600 ring-2 ring-blue-100'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`View ${index}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="flex h-auto w-full flex-col gap-6 rounded-2xl border-2 border-white bg-white p-6 shadow-sm lg:w-1/2">
            {/* Header */}
            <div>
              <div className="mb-2 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {product.category || 'Electronics'}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.productName}
              </h1>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`flex flex-col justify-center rounded-xl border p-4 transition-all ${getConditionStyles(product.condition)}`}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">
                  Condition
                </span>
                <span className="text-base font-bold capitalize leading-tight">
                  {product.condition}
                </span>
              </div>

              <div className="flex flex-col justify-center rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-900">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                  Color
                </span>
                <span className="text-base font-bold capitalize leading-tight">
                  {product.color}
                </span>
              </div>

              <div className="flex flex-col justify-center rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-900">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                  Storage
                </span>
                <span className="text-base font-bold capitalize leading-tight">
                  {product.storage}
                </span>
              </div>

              <div className="flex flex-col justify-center rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-900">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                  Battery Health
                </span>
                <span className="text-base font-bold capitalize leading-tight">
                  {product.battery ? `${product.battery}%` : 'N/A'}
                </span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Price & Action */}
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-500">Total Price</p>
              <h1 className="text-4xl font-bold text-blue-600">
                {moneyDhForma(product.listingPrice)}
              </h1>
            </div>

            <Button
              onClick={() => addToCart(product._id as any)} // ✅ fallback for undefined id
              className="w-full cursor-pointer bg-blue-600 py-6 text-lg font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200"
            >
              Add to Cart
            </Button>

            {/* Warranty Badge */}
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-800">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <p className="font-semibold">12-Month Warranty Included</p>
                <p className="text-sm text-blue-600/80">
                  Protected against defects and technical malfunctions.
                </p>
              </div>
            </div>

            {/* Seller Info */}
            <ProfilSeller product={product} />
          </div>
        </div>

        <div className="flex flex-col gap-8 pt-8 lg:flex-row">
          <div className="flex h-fit w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-white bg-white p-6 shadow-sm lg:w-1/2">
            <ChatApp productId={id ?? ''} /> {/* ✅ fallback for undefined */}
          </div>
          <div className="flex h-fit w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-white bg-white p-6 shadow-sm lg:w-1/2">
            <Policy />
          </div>
        </div>
      </div>
    </div>
  );
}