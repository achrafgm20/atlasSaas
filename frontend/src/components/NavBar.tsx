import { useNavigate, NavLink } from "react-router-dom";
import logo from '../assets/logoAtlas.png';
import { Box, Heart, ShoppingCart } from 'lucide-react';
import { UseAuth } from '@/context/AuthContext'
import UserIdNav from "./UserIdNav";
import { useFavorite } from "@/context/FavoriteContext";

import { useCart } from "@/context/CartFavContext";


function NavBar() {
  const navigate = useNavigate();
  
  const { user,logout } = UseAuth()
  const {getFavoriteCount} = useFavorite()
   const{getCartItemCount} =useCart()

  const navbar = [
    { id: 1, title: 'All Products', link: "/", icon: Box },
    { id: 2, title: 'Favorites', link: "/Favorites", icon: Heart },
    { id: 3, title: 'Cart', link: "/Cart", icon: ShoppingCart }
  ]
  
  return (
    <div className="w-auto">
      <nav className="w-auto h-20 text-black flex justify-around shadow-md items-center mx-auto p-2">
        <div className="flex justify-center items-center gap-4">
          <img src={logo} alt="Logo" className="w-auto h-10 mr-6 cursor-pointer" onClick={() => navigate('/')} />

          <ul className="flex gap-5">
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
              )
            })}
          </ul>

        </div>
        {
          user ? (
            <UserIdNav user={user}  logout={logout}/>
          ): (
            <div className="space-x-4">
          <NavLink to='/login' className="font-semibold hover:bg-gray-200 p-2 px-4 rounded-xl">Login</NavLink>

          <NavLink to='/regiter' className=" px-6 py-2 rounded-full font-semibold text-white bg-linear-to-r from-blue-500 to-blue-700 shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-200" >Register</NavLink>
        </div>

          )
        }
        
      </nav>
    </div>
  )
}

export default NavBar