import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import CardLoader from './CardLoader';

const Allproducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Pagination State ────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit] = useState(8); // products per page

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:4000/api/product/getAllProducts?page=${currentPage}&limit=${limit}`
        );

        if (!response.ok) throw new Error('Erreur réseau');

        const data = await response.json();

        if (data && data.products) {
          setProducts(data.products);
          // ─── Store pagination metadata from API ───
          if (data.pagination) {
            setTotalPages(data.pagination.totalPages || 1);
            setTotalProducts(data.pagination.totalProducts || data.products.length);
          }
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError('Impossible de charger les produits.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getAllProducts();
  }, [currentPage, limit]); // ← re-fetch when page or limit changes

  // ─── Page Change Handlers ────────────────────────────
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Generate page numbers with ellipsis ─────────────
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) pages.push('...');

      // Pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
      {/* ─── Header ──────────────────────────────────── */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {totalProducts} products found
        </h2>
        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* ─── Content ─────────────────────────────────── */}
      {loading ? (
        <div className="flex justify-center gap-2 items-center py-20">
          <CardLoader />
          <CardLoader />
          <CardLoader />
          <CardLoader />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 py-20 text-lg">
          No products found.
        </div>
      ) : (
        <>
          {/* ─── Product Grid ──────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item: PRODUCT) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>

          {/* ─── Pagination Controls ───────────────── */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              {/* Previous Button */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 cursor-pointer  py-2 rounded-lg border border-gray-300 text-sm font-medium
                           hover:bg-gray-100 transition-colors
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, index) =>
                typeof page === 'string' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 py-2 cursor-pointer  text-gray-400 text-sm"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`cursor-pointer w-10 h-10 rounded-lg text-sm font-semibold transition-colors
                      ${
                        currentPage === page
                          ? 'bg-gray-900 text-white shadow-md'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next Button */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="cursor-pointer px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium
                           hover:bg-gray-100 transition-colors
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Allproducts;