import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/PageLR';
import FormCreate from './components/Form';
import MainLayout from './page/layouts/MainLayout';
import DashboardLayout from './page/layouts/DashboardLayout';
import Dashboard from './page/home/Dashboard';
import Products from './page/home/Products';
import Orders from './page/home/Orders';
import Messages from './page/home/Messages';
import SalesOverview from './page/home/SalesOverview';
import { AuthProvider } from './context/AuthContext';
import SellerRoute from './page/layouts/SellerRoute';
import Allproducts from './page/buyerPage/page/Allproducts';
import Cart from './page/buyerPage/page/Cart';
import Favorites from './page/buyerPage/page/Favorites';


function App() {
  

  return (
    <>
    <AuthProvider>
    <BrowserRouter>
    <Routes>
      {/* fatima Routess */}
      <Route element={<MainLayout />}>
        <Route path='/' element={<Allproducts />} />
        <Route path='/Cart' element={<Cart />} />
        <Route path='/Favorites' element={<Favorites />} />
        <Route path='/regiter' element={<FormCreate />} />
        <Route path='/login' element={<LoginPage />} />
      </Route>


      <Route element={<SellerRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path='/dashboard/seller' element={<Dashboard />} />
          <Route path='/dashboard/products' element={<Products />} />
          <Route path='/dashboard/Orders' element={<Orders />} />
          <Route path='/dashboard/Messages' element={<Messages />} />
          <Route path='/dashboard/sales' element={<SalesOverview />} />
        </Route>
      </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
      
    </>
  )
}

export default App
