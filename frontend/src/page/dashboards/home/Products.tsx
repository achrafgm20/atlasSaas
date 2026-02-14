import CarteUI from "../components/CarteUI";
import FilterPanel from "../components/FilterPanel";
import FormBtn from "../components/FormBtn";
import StartCards from "../components/StartCards";

import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { UseAuth } from "@/context/AuthContext";
import PendingApproval from "../components/PendingApproval";

interface Product {
  _id: string;
  productName: string;
  listingPrice: number;
}

type ProductsResponse = {
  products: Product[];
};

export interface Filters {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

const getProducts = async (filters?: Filters): Promise<Product[]> => {
  const token = localStorage.getItem("token");
  
  let url = "http://localhost:4000/api/product";
  
  // If filters exist, use filter endpoint, otherwise use regular endpoint
  if (filters && Object.keys(filters).length > 0) {
    const params = new URLSearchParams();
    
    if (filters.keyword) params.append("keyword", filters.keyword);
    if (filters.category) params.append("category", filters.category.toUpperCase());
    if (filters.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString());
    
    url = `http://localhost:4000/api/product/filterProductSeller?${params.toString()}`;
  } else {
    url = "http://localhost:4000/api/product/getSellerProduct";
  }

  const response = await axios.get<ProductsResponse>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.products;
};

export default function ProductsPage() {
  const { user, fetchUser } = UseAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<Filters>({});
  const [showPendingModal, setShowPendingModal] = useState(false);

  const fetchProducts = async (filters?: Filters) => {
    setLoading(true);
    try {
      const fetchedProducts = await getProducts(filters);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: Filters) => {
    setCurrentFilters(filters);
    fetchProducts(filters);
  };

  const handleAddProductClick = () => {
    // Check if user status is pending
    if (user?.statutCompte === "Pending") {
      setShowPendingModal(true);
    }
    // If approved, FormBtn will handle the action
  };

  useEffect(() => {
    fetchProducts();
    if (!user) {
      fetchUser(); // Fetch user if token exists but user data is missing
    }
  }, [user]);

  console.log(user);

  if (loading) return <Loading text="Fetching products..." />;

  return (
    <div className="w-auto space-y-6">
      {/* Show Pending Approval Modal */}
      {showPendingModal && <PendingApproval onClose={() => setShowPendingModal(false)} />}

      <div className="flex justify-between items-center">
        <h1>Products Page</h1>
        
        {/* Show different UI based on account status */}
        {user?.statutCompte === "Approved" ? (
          <FormBtn onProductAdded={() => fetchProducts(currentFilters)} />
        ) : user?.statutCompte === "Pending" ? (
          <button
            onClick={handleAddProductClick}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-60 hover:opacity-70 transition-opacity"
          >
            Add Product (Pending Approval)
          </button>
        ) : (
          <button
            onClick={handleAddProductClick}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-60"
            disabled
          >
            Add Product
          </button>
        )}
      </div>

      <StartCards products={products} />
      
      <div className="flex gap-8">
        <FilterPanel onFilterChange={handleFilterChange} />
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Products Yet
            </h2>
            <p className="text-gray-500">
              {user?.statutCompte === "Pending" 
                ? "Your account is pending approval. Once approved, you can add products."
                : "Welcome! You have 0 products. Click 'Add Product' to get started."}
            </p>
          </div>
        ) : (
          <>
            {products.map((product) => (
              <CarteUI key={product._id} product={product} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}