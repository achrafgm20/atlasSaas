import {  useNavigate } from "react-router-dom";
import logo from '../assets/logoAtlas.png';

function NavBar() {
  const navigate = useNavigate();
 
  return (
  <div className="w-auto">
    <nav className="w-auto h-20 text-black flex justify-around bg-gray-200  items-center mx-auto   p-2 ">
        <div>
           <img src={logo} alt="Logo" className="w-auto h-10 cursor-pointer" onClick={() => navigate('/')} />
        </div>
        <ul className="flex gap-8 text-lg font-medium cursor-pointer">
            <li>Home1</li>
            <li>Home2</li>
            <li>Home3</li>
        </ul>
        <div className="space-x-4">
          <button className="bg-[#0EA5E9] px-8 py-2 rounded-md text-white cursor-pointer hover:bg-blue-500 font-bold" onClick={() => navigate('/login')}>Log in</button>
          <button className="border-[#0EA5E9] border-2 px-8 py-2 rounded-md text-black cursor-pointer hover:bg-[#3AB6FC] font-bold" onClick={() => navigate('/regiter')}>Register</button>
        </div>
        
    </nav>
  </div>
    
  )
}

export default NavBar