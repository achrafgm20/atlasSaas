// import CarteUI from "../components/CarteUI";
// import FilterPanel from "../components/FilterPanel";
// import FormBtn from "../components/FormBtn";
// import StartCards from "../components/StartCards";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import Loading from "../components/Loading";
 


// interface Product {
//   _id: string;
//   productName: string;
//   listingPrice: number;
// }

// type ProductsResponse = {
//   products: Product[];
// };

// const getProducts = async (): Promise<Product[]> => {
//   const token = localStorage.getItem("token");

//   const response = await axios.get<ProductsResponse>(
//     "http://localhost:4000/api/product/getSellerProduct",
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   return response.data.products;
// };


// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(false);
//    const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const fetchedProducts = await getProducts();
//       setProducts(fetchedProducts);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []); 

//  if(loading) return <Loading text="Fetching products..." />

//   return (
//     <div className="w-auto space-y-6  ">
//       <div className="flex justify-between item ">
//         <h1>Products Page</h1>
//         <FormBtn onProductAdded={fetchProducts} />
//       </div>
//       <StartCards  products={products}/>
//       <div className="flex gap-8">
//         <FilterPanel />
//       </div>
//       <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  gap-6">
//         {products.length === 0 ?<h1 className="text-center font-semibold ">Welcome you have 0 product you can create product now Click in the Add Product</h1> : 
//         <>{products.map((product) => (
//           <CarteUI key={product._id} product={product} />
//         ))}</>
//         }
//       </div>
      
//     </div>
//   )
// }
import CarteUI from "../components/CarteUI";
import FilterPanel from "../components/FilterPanel";
import FormBtn from "../components/FormBtn";
import StartCards from "../components/StartCards";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<Filters>({});

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

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <Loading text="Fetching products..." />;

  return (
    <div className="w-auto space-y-6">
      <div className="flex justify-between item">
        <h1>Products Page</h1>
        <FormBtn onProductAdded={() => fetchProducts(currentFilters)} />
      </div>
      <StartCards products={products} />
      <div className="flex gap-8">
        <FilterPanel onFilterChange={handleFilterChange} />
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <h1 className="text-center font-semibold">
            Welcome you have 0 product you can create product now Click in the Add Product
          </h1>
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
