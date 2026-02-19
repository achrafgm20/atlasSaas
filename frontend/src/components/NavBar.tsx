import { useState } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import logo from '../assets/logoAtlas.png';
import { Box, Heart, ShoppingCart, Boxes, Menu, X ,UserStar} from 'lucide-react';
import { UseAuth } from '@/context/AuthContext';
import UserIdNav from "./UserIdNav";
import { useFavorite } from "@/context/FavoriteContext";
import { useCart } from "@/context/CartFavContext";

function NavBar() {
  const navigate = useNavigate();
  const { user, logout } = UseAuth();
  const { getFavoriteCount } = useFavorite();
  const { getCartItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // All possible navigation items
  const allNavItems = [
    { id: 1, title: 'All Products', link: "/", icon: Box, roles: ['Buyer', 'Seller'] },
    { id: 2, title: 'Favorites', link: "/Favorites", icon: Heart, roles: ['Buyer'] },
    { id: 3, title: 'Cart', link: "/Cart", icon: ShoppingCart, roles: ['Buyer'] },
    { id: 4, title: 'Order', link: "/Order", icon: Boxes, roles: ['Buyer'] },
    { id: 5, title: 'Admin', link: "/admin/dashboard", icon: UserStar, roles: ['Admin'] }
  ];

  // Filter navigation items based on user role
  const navbar = user 
    ? allNavItems.filter(item => item.roles.includes(user.role))
    : allNavItems.filter(item => item.roles.includes('Buyer')); // Default to Buyer items when not logged in

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="w-full sticky top-0 z-50 bg-white shadow-md">
      <nav className="w-full  h-20 text-black flex justify-between shadow-md items-center px-4 md:px-8">
        {/* Logo */}
        <img 
          src={logo} 
          alt="Logo" 
          className="w-auto h-10 cursor-pointer" 
          onClick={() => navigate('/')} 
        />

        {/* Desktop Navigation */}
        <ul className="hidden xl:flex gap-5">
          {navbar.map((nav) => {
            const Icon = nav.icon;
            return (
              <NavLink
                to={nav.link}
                key={nav.id}
                className={({ isActive }) =>
                  `flex items-center text-gray-700 gap-2 p-2 rounded-xl cursor-pointer font-semibold relative
                    ${isActive
                    ? "bg-[#1E3A8A] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={20} /> 
                {nav.title}
                
                {nav.title === 'Favorites' && getFavoriteCount() > 0 && (
                  <span className="bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getFavoriteCount()}
                  </span>
                )} 
                {nav.title === 'Cart' && getCartItemCount() > 0 && (
                  <span className="bg-blue-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getCartItemCount()}
                  </span>
                )}
              </NavLink>
            );
          })}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden xl:block">
          {user ? (
            <UserIdNav user={user} logout={logout} />
          ) : (
            <div className="space-x-4">
              <NavLink to='/login' className="font-semibold hover:bg-gray-200 p-2 px-4 rounded-xl">
                Login
              </NavLink>
              <NavLink 
                to='/regiter' 
                className="px-6 py-2 rounded-full font-semibold text-white bg-linear-to-r from-blue-500 to-blue-700 shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
              >
                Register
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMenu} />
      )}

      {/* Mobile Menu */}
      <div className={`xl:hidden fixed top-20 right-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col p-4">
          {/* Mobile Navigation Links */}
          <ul className="flex flex-col gap-2 mb-6">
            {navbar.map((nav) => {
              const Icon = nav.icon;
              return (
                <NavLink
                  to={nav.link}
                  key={nav.id}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-xl cursor-pointer font-semibold relative
                      ${isActive
                      ? "bg-[#1E3A8A] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon size={20} /> 
                  {nav.title}
                  
                  {nav.title === 'Favorites' && getFavoriteCount() > 0 && (
                    <span className="bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold ml-auto">
                      {getFavoriteCount()}
                    </span>
                  )} 
                  {nav.title === 'Cart' && getCartItemCount() > 0 && (
                    <span className="bg-blue-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold ml-auto">
                      {getCartItemCount()}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </ul>

          {/* Mobile Auth Section */}
          <div className="border-t pt-4">
            {user ? (
              <UserIdNav user={user} logout={logout} />
            ) : (
              <div className="flex flex-col gap-3">
                <NavLink 
                  to='/login' 
                  onClick={closeMenu}
                  className="font-semibold text-center hover:bg-gray-200 p-3 rounded-xl"
                >
                  Login
                </NavLink>
                <NavLink 
                  to='/regiter' 
                  onClick={closeMenu}
                  className="px-6 py-3 rounded-full font-semibold text-white bg-linear-to-r from-blue-500 to-blue-700 shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-200 text-center"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;