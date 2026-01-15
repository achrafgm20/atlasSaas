import NavBar from '@/components/NavBar'

import { Outlet } from 'react-router-dom'
import Footer from '../buyerPage/components/Footer'

import { CartProvider } from '@/context/CartFavContext'

export default function MainLayout() {
  return (
    <>
    <CartProvider >
        <NavBar />
        <main className='h-screen'>
            <Outlet />
            <Footer />
        </main>
    </CartProvider>
        
    </>
  )
}
