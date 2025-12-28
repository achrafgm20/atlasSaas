import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';

import LoginPage from './components/PageLR';
import FormCreate from './components/Form';
import Home from './components/Home';
import SellerDashboard from './page/dashboards/SellerDashboard';


function App() {
  

  return (
    <>
    <BrowserRouter>
      <NavBar />
      <Routes>
          
            <Route path='/' element={<Home />} />
            <Route path='/regiter' element={<FormCreate />} />
            <Route path='/login' element={<LoginPage />} />
          <Route path="/dashboard/seller" element={<SellerDashboard />} />
      </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App