import NavBar from '@/components/NavBar'

import { Outlet } from 'react-router-dom'
import Footer from '../buyerPage/components/Footer'

export default function MainLayout() {
  return (
    <>
        <NavBar />
        <main className='h-screen'>
            <Outlet />
            <Footer />
        </main>
        
        
    </>
  )
}
