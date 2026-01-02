import img from '@/assets/22.jpg'
import { Eye, Pencil, Trash } from 'lucide-react'

export default function CarteUI({product}: any) {


  return (
    <div className="flex flex-col w-auto p-2  shadow-md bg-white hover:shadow-xl  rounded-xl">
        <img src={img} alt='img' className='bg-cover'/>
        <div className='flex justify-around p-2 border-b-2 border-gray-200'>
            <p className='bg-green-200 font-semibold py-0.5 px-2 rounded-xl capitalize'>{product.status}</p>
            <p className="capitalize">{product.condition}</p>
        </div>
        <div>
            <h2 className='font-semibold text-md capitalize'>{product.productName}</h2>
            
            <div className='flex justify-around font-light border-b-2 py-2'>
                <p className='capitalize'>{product.category}</p>
                <p>{product.storage}</p>
                <p className="capitalize">{product.color}</p>
                <p>{product.battery}</p>
            </div>
            <div className='flex justify-around py-2'>
                <p className='text-xl '>Selling {product.listingPrice}Dh</p> 
            </div>
            <div className='flex justify-around'>
                <button className='bg-gray-100 px-4 py-1 rounded-2xl cursor-pointer hover:bg-blue-200'><Eye size={20} /></button>
                <button className='bg-gray-100 px-4 py-1 rounded-2xl cursor-pointer hover:bg-red-200'><Trash  size={20} /></button>
                <button className='bg-gray-100 px-4 py-1 rounded-2xl cursor-pointer hover:bg-blue-200'><Pencil  size={20} /></button>
            </div>
        </div>
    </div>
  )
}
