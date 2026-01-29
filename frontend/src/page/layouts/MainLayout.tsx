import NavBar from '@/components/NavBar'

import { Outlet } from 'react-router-dom'
import Footer from '../buyerPage/components/Footer'

import { CartProvider } from '@/context/CartFavContext'
import { FavoriteProvider } from '@/context/FavoriteContext'

export default function MainLayout() {
  return (
    <>
    <CartProvider >
      <FavoriteProvider>
        <NavBar />
        <main className='h-screen'>
            <Outlet />
            <Footer />
        </main>
      </FavoriteProvider>
        
    </CartProvider>
        
    </>
  )
}
