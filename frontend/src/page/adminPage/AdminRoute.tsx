import { UseAuth } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';


const AdminRoute = () => {
  const { user, token } = UseAuth();

  // Check if user is authenticated and has the 'admin' role
  if (!token || !user || user.role !== 'Admin' ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
