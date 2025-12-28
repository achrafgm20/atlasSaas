import ProductsPage from "./components/ProductsPage";
import Sidebar from "./components/Sidebar";

export default function SellerDashboard() {
  return (
    <div>
      
      <section className="flex min-h-screen bg-[#1E3A8A]">
        <Sidebar />
        <div className="flex-1  bg-[#F5F7FB]">
          <header className="flex items-center justify-between px-8 py-4 border-b bg-white sticky z-10">
            <h1>Seller Dashboard</h1>
            <h2>User info</h2>
          </header>
          <main className="px-8 py-4">
            <ProductsPage />
          </main>
        </div>
      </section>
    </div>
  )
}
