import { LogOut,Store,User ,BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function UserIdNav({user, logout} : {user: any, logout: () => void}) {
  return (
    <div className="space-x-4 flex justify-center items-center">
        <div className='flex gap-2 rounded-full p-2 hover:bg-gray-200 cursor-pointer' >
            {user.role === 'Seller' ? (
                <Link to='/dashboard' className='flex gap-2 rounded-full p-2 hover:bg-gray-200 cursor-pointer justify-center items-center ' >
                    <Store /> 
                  {user.name} 
                    <BadgeCheck size={20} className='text-blue-600' />
                </Link>)
            : (
                <div className='flex  gap-2 rounded-full p-2 hover:bg-gray-200 cursor-pointer' >
                    <User />
                    {user.name} 
                </div>)}
            
            
         </div>
         <button onClick={logout} className="p-2 rounded-full font-semibold cursor-pointer hover:bg-gray-200  transition-all duration-200">
            <LogOut />
         </button>
    </div>
  )
}
