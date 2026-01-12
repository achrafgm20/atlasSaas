import { Button } from '@/components/ui/button';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, CheckCircle2, User } from 'lucide-react'; 
import {moneyDhForma} from '@/lib/utils'


// 2. Define the Image Interface 
// (Handling cases where image might be an object with a url or just a string)
type ProductImage = { url: string } | string;


interface Product {
  _id: string;
  productName: string;
  description: string;
  category: string;
  condition: string; // or specific union: "Brand New" | "Grade A" | "Grade B" | "Fair"
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

// 4. Define Props for the SpecCard Component





export default function ProductPageBuyer() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const { id } = useParams<{ id: string }>();


  
const getConditionStyles = (condition: string): string => {
  switch (condition) {
    case "Brand New": 
      return "bg-yellow-400 text-yellow-950 border-yellow-500";
    case "Grade A":   
      return "bg-green-500 text-white border-green-600";
    case "Grade B":   
      return "bg-blue-500 text-white border-blue-600";
    case "Fair":      
      return "bg-gray-600 text-white border-gray-700";
    default:          
      return "bg-white border-gray-200 text-gray-900";
  }
};

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:4000/api/product/getProductDetails/${id}`)
      .then((res) => {
        setProduct(res.data);
        // Set the first image as default if available
        if (res.data.images && res.data.images.length > 0) {
          // Adjust '.url' depending on your actual image object structure (e.g., img.url or just img)
          setSelectedImage(res.data.images[0].url || res.data.images[0]); 
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#e2edf7]">
        <div className="text-xl font-semibold text-blue-600">Loading product details...</div>
      </div>
    );
  }

  if (!product) return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="min-h-screen bg-[#e2edf7] px-4 py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col">
        
        {/* Navigation */}
        <div className="mb-6">
          <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent text-blue-700 hover:text-blue-900">
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
              {product.images?.map((img, index) => {
                 const imgUrl = img.url || img; // Handle object or string
                 return (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 bg-white transition-all ${
                      selectedImage === imgUrl ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <img src={imgUrl} alt={`View ${index}`} className="h-full w-full object-cover" />
                  </button>
                )
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
              <h1 className="text-3xl font-bold text-gray-900">{product.productName}</h1>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Condition Div */}
              <div className={`flex flex-col justify-center rounded-xl border p-4 transition-all ${getConditionStyles(product.condition)}`}>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Condition</span>
                <span className="text-base font-bold capitalize leading-tight">{product.condition}</span>
              </div>

              {/* Color Div */}
              <div className="flex flex-col justify-center rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-900">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Color</span>
                <span className="text-base font-bold capitalize leading-tight">{product.color}</span>
              </div>

              {/* Storage Div */}
              <div className="flex flex-col justify-center rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-900">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Storage</span>
                <span className="text-base font-bold capitalize leading-tight">{product.storage}</span>
              </div>

              {/* Battery Health Div */}
              <div className="flex flex-col justify-center rounded-xl border border-gray-100 bg-gray-50 p-4 text-gray-900">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Battery Health</span>
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

            <Button className="w-full bg-blue-600 py-6 text-lg font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200">
              Add to Cart
            </Button>

            {/* Warranty Badge */}
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-800">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <p className="font-semibold">12-Month Warranty Included</p>
                <p className="text-sm text-blue-600/80">Protected against defects and technical malfunctions.</p>
              </div>
            </div>

            {/* Seller Info */}
            <div className="mt-auto border-t border-gray-100 pt-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Sold By</p>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.seller?.name || 'Unknown Seller'}
                  </h3>
                  <p className="text-sm text-gray-500">Verified Seller</p>
                </div>
                <div className="ml-auto">
                    <Button variant="outline" size="sm" className="text-xs">View Profile</Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

