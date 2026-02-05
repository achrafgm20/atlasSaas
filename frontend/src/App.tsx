import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/PageLR';
import FormCreate from './components/Form';
import MainLayout from './page/layouts/MainLayout';
import DashboardLayout from './page/layouts/DashboardLayout';
import Dashboard from './page/dashboards/home/Dashboard';
import Products from './page/dashboards/home/Products';
import Orders from './page/dashboards/home/Orders';

import SalesOverview from './page/dashboards/home/SalesOverview';
import { AuthProvider } from './context/AuthContext';
import SellerRoute from './page/layouts/SellerRoute';
import Home from './page/buyerPage/pageBuyer/Home';
import PageCart from './page/buyerPage/pageBuyer/PageCart';
import PageFavorite from './page/buyerPage/pageBuyer/PageFavorite';
import ErrorPage from './page/buyerPage/components/ErrorPage';
import ProductPageBuyer from './page/buyerPage/pageBuyer/ProductPageBuyer';
import ProductPageSeller from './page/dashboards/components/ProductPageSeller';
import PageOrder from './page/buyerPage/pageBuyer/PageOrder';
import Settings from './page/dashboards/home/Settings';
import PaymentSuccess from './page/buyerPage/components/PaymentSuccess';
import PaymentFailed from './page/buyerPage/components/PaymentFailed';
import Notifications from './page/dashboards/home/Notifications';
import DashboardAdmin from './page/adminPage/page/DashboardAdmin';


function App() {
  

  return (
    <>
    
    <BrowserRouter>
    <AuthProvider>
    <Routes>
      {/* Buyer Routess */}
      <Route element={<MainLayout />}>
        <Route path='/' element={<Home />} />
        <Route path='/:id' element={<ProductPageBuyer />} />
        <Route path='/Cart' element={<PageCart />} />
        <Route path='/Order' element={<PageOrder />} />
        <Route path='/Favorites' element={<PageFavorite />} />
        <Route path='/regiter' element={<FormCreate />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/PaymentSuccess' element={<PaymentSuccess />} />
        <Route path='/PaymentFailed' element={<PaymentFailed />} />
        
      </Route>

      {/* Seller Routess */}
      <Route element={<SellerRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path='/dashboard/seller' element={<Dashboard />} />
          <Route path='/dashboard/products' element={<Products />} />
          <Route path='/dashboard/ProductPageSeller/:id' element={<ProductPageSeller />} />
          <Route path='/dashboard/Orders' element={<Orders />} />
          <Route path='/dashboard/Notifications' element={<Notifications />} />
          <Route path='/dashboard/sales' element={<SalesOverview />} />
          <Route path='/dashboard/settings' element={<Settings />} />
        </Route>
      </Route>
      {/* admin Routess */}
      <Route>
        <Route path='/admin' element={<DashboardAdmin />} />
      </Route>
      {/* Error page */}
      <Route path="*" element={<ErrorPage />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
    
      
    </>
  )
}

export default App
