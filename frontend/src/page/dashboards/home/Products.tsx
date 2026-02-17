import CarteUI from "../components/CarteUI";
import FilterPanel from "../components/FilterPanel";
import FormBtn from "../components/FormBtn";
import StartCards from "../components/StartCards";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import PendingApproval from "../components/PendingApproval";

interface Product {
  _id: string;
  productName: string;
  listingPrice: number;
}

interface User {
  _id: string;
  name?: string;
  email?: string;
  statutCompte?: string;
  canReceiveTransfers?: boolean;
  [key: string]: any;
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

  if (filters && Object.keys(filters).length > 0) {
    const params = new URLSearchParams();

    if (filters.keyword) params.append("keyword", filters.keyword);
    if (filters.category)
      params.append("category", filters.category.toUpperCase());
    if (filters.minPrice !== undefined)
      params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== undefined)
      params.append("maxPrice", filters.maxPrice.toString());

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

const fetchCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const response = await axios.get<User>(
      "http://localhost:4000/api/users/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<Filters>({});
  const [showPendingModal, setShowPendingModal] = useState(false);

  const fetchUser = async () => {
    setUserLoading(true);
    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setUserLoading(false);
    }
  };

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
    if (user?.statutCompte === "Pending") {
      setShowPendingModal(true);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchProducts();
  }, []);

  console.log(user);

  if (userLoading || loading) return <Loading text="Fetching data..." />;

  const isApproved = user?.statutCompte === "Approved";
  const isPending = user?.statutCompte === "Pending";
  const canReceiveTransfers = user?.canReceiveTransfers === true;

  return (
    <div className="w-auto space-y-6">
      {showPendingModal && (
        <PendingApproval onClose={() => setShowPendingModal(false)} />
      )}

      {/* Stripe Connect Banner — only shown when approved but Stripe not connected */}
      {isApproved && !canReceiveTransfers && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-300 rounded-xl px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <svg
                className="w-6 h-6 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Stripe Account Not Connected
              </p>
              <p className="text-sm text-amber-600">
                You need to connect your Stripe account to receive payments and
                start selling products.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/settings")}
            className="ml-4 shrink-0 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Connect Stripe Account
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1>Products Page</h1>

        {isApproved ? (
          canReceiveTransfers ? (
            <FormBtn onProductAdded={() => fetchProducts(currentFilters)} />
          ) : (
            <button
              onClick={() => navigate("/dashboard/settings")}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              Connect Stripe to Add Products
            </button>
          )
        ) : isPending ? (
          <button
            onClick={handleAddProductClick}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-60 hover:opacity-70 transition-opacity"
          >
            Add Product (Pending Approval)
          </button>
        ) : (
          <button
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
              {isPending
                ? "Your account is pending approval. Once approved, you can add products."
                : isApproved && !canReceiveTransfers
                ? "Please connect your Stripe account in Settings before adding products."
                : "Welcome! You have 0 products. Click 'Add Product' to get started."}
            </p>
          </div>
        ) : (
          <>
            {products.map((product ) => (
              <CarteUI key={product._id } product={product} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}