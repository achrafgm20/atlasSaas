
import { UseAuth } from '@/context/AuthContext';
import Sidebar from '../dashboards/components/Sidebar'
import { Outlet } from 'react-router-dom'
import { User } from 'lucide-react';

export default function DashboardLayout() {
  const { user } = UseAuth();
  return (
    <>
        <section className="flex min-h-screen bg-[#1E3A8A]">
            <Sidebar />
            <div className="flex-1  bg-[#F5F7FB]">
              <header className="flex items-center  justify-between px-8 py-4 border-b bg-white sticky z-10">
                <h1 className='font-bold text-3xl'>Seller Dashboard</h1>
                <h2 className='bg-gray-100 px-2 py-3 flex rounded-xl  font-semibold'> <User size={20} />{user?.name}</h2>
              </header>
              <div className="px-8 py-4">
                <Outlet />
              </div>      
            </div>
        </section>
    </>
  )
}
