import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  LogOut,
  UserCog 
} from "lucide-react";
import logo from '../../../assets/logoAtlas.png'
import { UseAuth } from "@/context/AuthContext";
function Sidebar() {
    const {logout} = UseAuth()
    const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/seller' },
  { name: 'Products', icon: Package, path: '/dashboard/products' },
  { name: 'Orders', icon: ShoppingCart, path: '/dashboard/orders' },
  { name: 'Notifications', icon: MessageSquare, path: '/dashboard/Notifications'},
  { name: 'Sales Overview', icon: BarChart3, path: '/dashboard/sales' },
  {name: 'Settings', icon: UserCog, path: '/dashboard/settings'}
];
  return (
    <div className="flex flex-col py-5 justify-between w-64 h-auto ">
        <div className="flex flex-col ">
            <Link to="/" className="flex flex-col justify-center pb-5 border-b border-slate-300/50 items-center   ">
                <img src={logo} alt="logo" className="w-30 " />               
            </Link>
            
            <div className="flex flex-col text-white p-4 space-y-1">
                {navItems.map((item, index) => (
                   <NavLink to={item.path} key={index} className={({isActive}) => `flex items-center justify-between p-3 rounded-xl transition-all ${
                isActive ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'hover:bg-slate-800'}` }>
                    <div className="flex items-center">
                        <item.icon size={20} />
                        <span className="ml-2"> {item.name}</span>
                    </div>

                </NavLink>))}
            </div>
        </div>
        
        <div className="p-4  border-t border-slate-300/50">
            <button onClick={() =>logout()} className="flex text-white cursor-pointer  items-center gap-3 p-3 w-full hover:bg-slate-800 rounded-xl transition-all">   
                    <LogOut size={20} />
                    <span>Logout</span>
            </button>
            
        </div>
    </div>
  )
}

export default Sidebar