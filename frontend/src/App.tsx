import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/PageLR';
import FormCreate from './components/Form';
import MainLayout from './page/layouts/MainLayout';
import DashboardLayout from './page/layouts/DashboardLayout';
import Dashboard from './page/dashboards/home/Dashboard';
import Products from './page/dashboards/home/Products';
import Orders from './page/dashboards/home/Orders';
import Messages from './page/dashboards/home/Messages';
import SalesOverview from './page/dashboards/home/SalesOverview';
import { AuthProvider } from './context/AuthContext';
import SellerRoute from './page/layouts/SellerRoute';
import Home from './page/buyerPage/page/Home';
import PageCart from './page/buyerPage/page/PageCart';
import PageFavorite from './page/buyerPage/page/PageFavorite';


function App() {
  

  return (
    <>
    <AuthProvider>
    <BrowserRouter>
    <Routes>
      {/* fatima Routess */}
      <Route element={<MainLayout />}>
        <Route path='/' element={<Home />} />
        <Route path='/Cart' element={<PageCart />} />
        <Route path='/Favorites' element={<PageFavorite />} />
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
