
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckCircle, 
  ShoppingCart, 
  TrendingUp, 
} from 'lucide-react';

const SideBarAdmin = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/BuyerSellerPage', label: 'Users & Vendors', icon: Users },
    { path: '/admin/SellerAproval', label: 'Vendor Approvals', icon: CheckCircle },
    { path: '/admin/OrdersAdmin', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/dashboardSales', label: 'Sales & Revenue', icon: TrendingUp },
    
  ];

  return (
    <aside className=" h-screen w-60 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Header */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-base">AT</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AtlasTech</h3>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all border-l-3
                ${isActive 
                  ? 'bg-purple-50 text-blue-700 border-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                }
              `}
            >
              <Icon size={20} className="hrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SideBarAdmin;