
import { UseAuth } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';


const SellerRoute = () => {
  const { user, token } = UseAuth();

  // Check if user is authenticated and has the 'seller' role
  if (!token || !user || user.role !== 'Seller' ) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default SellerRoute;
