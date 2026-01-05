import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const Allproducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        setLoading(true);
        // Appel à votre API Express
        const response = await fetch('http://localhost:5000/api/product/getAllProducts');
        
        if (!response.ok) throw new Error('Erreur réseau');
        
        const data = await response.json();

        // CORRECTION : Votre API renvoie { products: [...], pagination: {...} }
        // On vérifie si data.products existe avant de le stocker
        if (data && data.products) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError("Impossible de charger les produits.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getAllProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {products ? products.length : 0} products found
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-blue-600 font-bold">Loading products...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
          {products && products.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Allproducts;