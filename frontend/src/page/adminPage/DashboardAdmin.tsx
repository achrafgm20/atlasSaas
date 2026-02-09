
import { UseAuth } from '@/context/AuthContext';

import { Outlet } from 'react-router-dom'
import { Store } from 'lucide-react';
import SideBarAdmin from './components/SideBarAdmin';


export default function DashboardAdmin() {
  const {user } = UseAuth();

  return (
    <>
      <section className="flex min-h-screen bg-[#1E3A8A]">
        <SideBarAdmin />
        
        <div className="flex-1 bg-[#F5F7FB] w-full lg:w-auto">
          
          <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 border-b bg-white sticky top-0 z-10">
            {/* Add padding on mobile to account for hamburger menu */}
            <h1 className='font-bold text-xl sm:text-2xl lg:text-3xl ml-12 lg:ml-0'>
              Admin Dashboard
            </h1>
            
            <div className='flex gap-2 sm:gap-5 items-center'>
              <h2 className='bg-gray-100 px-2 py-2 sm:py-3 flex rounded-xl font-semibold gap-1 items-center text-sm sm:text-base'> 
                <Store size={20} className="hidden sm:block" />
                <span className="truncate max-w-25 sm:max-w-none">
                  Admin - {user?.name || 'Admin'}
                </span>
              </h2>
            </div>
          </header>
          
          <div className="px-4 sm:px-6 lg:px-8 py-4 bg-gray-100 min-h-[calc(100vh-73px)]">
            <Outlet />
          </div>      
        </div>
      </section>
    </>
  )
}