import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  LogOut,
  UserCog,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import logo from '../../../assets/logoAtlas.png'
import { UseAuth } from "@/context/AuthContext";
import { useState } from "react";

function Sidebar() {
    const {logout} = UseAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(true);
    
    const navItems = [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/sales' },
      { name: 'Products', icon: Package, path: '/dashboard/products' },
      { name: 'Orders', icon: ShoppingCart, path: '/dashboard/orders' },
      { name: 'Notifications', icon: MessageSquare, path: '/dashboard/Notifications'},
      
      {name: 'Settings', icon: UserCog, path: '/dashboard/settings'}
    ];

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-lg shadow-lg"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={closeMobileMenu}
          />
        )}

        {/* Sidebar */}
        <div className={`
          flex flex-col py-5 justify-between h-screen bg-blue-900
          fixed lg:sticky top-0 left-0 z-40
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'w-64'}
        `}>
          {/* Collapse Toggle Button (Desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block cursor-pointer absolute -right-3 top-8 bg-slate-800 text-white p-1.5 rounded-full shadow-lg hover:bg-slate-700 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <div className="flex flex-col">
            <Link 
              to="/" 
              className="flex flex-col justify-center pb-5 border-b border-slate-300/50 items-center px-4"
              onClick={closeMobileMenu}
            >
              <img 
                src={logo} 
                alt="logo" 
                className={`transition-all duration-300 ${isCollapsed ? 'w-10' : 'w-30'}`} 
              />               
            </Link>
            
            <div className="flex flex-col text-white p-4 space-y-1">
              {navItems.map((item, index) => (
                <NavLink 
                  to={item.path} 
                  key={index} 
                  onClick={closeMobileMenu}
                  className={({isActive}) => `flex items-center p-3 rounded-xl transition-all group relative ${
                    isActive ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'hover:bg-slate-800'
                  } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                  title={isCollapsed ? item.name : ''}
                >
                  <div className={`flex items-center ${isCollapsed ? '' : 'gap-2'}`}>
                    <item.icon size={20} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>

                  {/* Tooltip on hover when collapsed */}
                  {isCollapsed && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                      {item.name}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t border-slate-300/50">
            <button 
              onClick={() => {
                logout();
                closeMobileMenu();
              }} 
              className={`flex text-white cursor-pointer items-center gap-3 p-3 w-full hover:bg-slate-800 rounded-xl transition-all group relative ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? 'Logout' : ''}
            >   
              <LogOut size={20} />
              {!isCollapsed && <span>Logout</span>}

              {/* Tooltip on hover when collapsed */}
              {isCollapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      </>
    )
}

export default Sidebar