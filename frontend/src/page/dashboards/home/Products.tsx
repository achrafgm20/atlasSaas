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

const getProducts = async (): Promise<Product[]> => {
  const token = localStorage.getItem("token");

  const response = await axios.get<ProductsResponse>(
    "http://localhost:4000/api/product/getSellerProduct",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.products;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
//getProducts().then(setProducts);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    
    setLoading(true);
  }, []);
 if(loading) return <Loading text="Fetching products..." />

  return (
    <div className="w-auto space-y-6  ">
      <div className="flex justify-between item ">
        <h1>Products Page</h1>
        <FormBtn  />
      </div>
      <StartCards  products={products}/>
      <div className="flex gap-8">
        <FilterPanel   />
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4   gap-6">
        
        {products.map((product) => (
          <CarteUI key={product._id} product={product} />
        ))}
        
      </div>
      
    </div>
  )
}
