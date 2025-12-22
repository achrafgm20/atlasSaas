import { useNavigate } from "react-router-dom";


function NavBar() {
  const navigate = useNavigate();
 
  return (
  <div className="bg-gray-200 w-auto">
    <nav className="w-auto h-20  flex justify-around   items-center mx-auto bg-gray-200 p-2 ">
        <div>
           <h2>logo</h2>
        </div>
        <ul className="flex gap-8 text-lg font-medium cursor-pointer">
            <li>Home1</li>
            <li>Home2</li>
            <li>Home3</li>
        </ul>
        <button className="bg-[#0EA5E9] px-8 py-2 rounded-md text-white cursor-pointer hover:bg-blue-500 font-bold" onClick={() => navigate('/login')}>Log in</button>
    </nav>
  </div>
    
  )
}

export default NavBar