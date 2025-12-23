import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';

import LoginPage from './components/PageLR';
import FormCreate from './components/Form';


function App() {
  

  return (
    <>
    <BrowserRouter>
    <NavBar />
      <Routes>
          <Route path='/regiter' element={<FormCreate />} />
          <Route path='/login' element={<LoginPage />} />
          
      </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App