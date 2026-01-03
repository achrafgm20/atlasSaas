import img from '@/assets/22.jpg'
import { Eye, Laptop, Pencil, Smartphone, Trash } from 'lucide-react'

export default function CarteUI({product}: any) {

    const gradeClass = 
    product.condition === "Brand New" ? "bg-yellow-400 text-white" :
    product.condition === "Grade A"     ? "bg-green-500 text-white" :
    product.condition === "Grade B"     ? "bg-blue-400 text-black" :
    product.condition === "Fair"       ? "bg-gray-500 text-white" :
    "bg-gray-200 text-black"; // default 
    
    
    const ProductCategory = ({ category }: { category: string }) => {
    switch (category.toLowerCase()) {
      case "phone":
        return <Smartphone size={20} className="mr-1" />;
      case "laptop":
        return <Laptop size={20} className="mr-1" />;
      default:
        return null;
    }
  }
  return (
    <div className="flex flex-col w-auto p-2  shadow-md bg-white hover:shadow-xl  rounded-xl">
        <div className='relative'>
            <img src={img} alt='img' className='bg-cover'/>
            <span className='absolute top-4 right-3'>
                <p className={` capitalize px-3 py-1 rounded-full font-semibold ${gradeClass}`}>{product.condition}</p>
            </span>
        </div>
        <div>
            <h2 className='font-semibold text-md capitalize'>{product.productName}</h2>
            
            <div className='flex justify-around font-light border-b-2 py-2'>
                <ProductCategory category={product.category} />
                <p>{product.storage}</p>
                <p className="capitalize">{product.color}</p>
                <p>{product.battery}</p>
            </div>
            
            {/* Price Section */}
        <div className='py-2'>
          <p className='text-gray-600 text-sm'>Selling Price</p>
          <p className='text-blue-600 text-2xl'>{product.listingPrice} Dh</p>
        </div>
        
        
        {/* Action Buttons */}
        <div className='flex gap-2 pt-2'>
          <button 
            className='flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-colors duration-200'
            aria-label="View product"
          >
            <Eye size={18} />
            <span className='hidden xl:inline text-sm'>View</span>
          </button>
          <button 
            className='flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors duration-200'
            aria-label="Edit product"
          >
            <Pencil size={18} />
            <span className='hidden xl:inline text-sm'>Edit</span>
          </button>
          <button 
            className='flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-colors duration-200'
            aria-label="Delete product"
          >
            <Trash size={18} />
            <span className='hidden xl:inline text-sm'>Delete</span>
          </button>
        </div>
        </div>
    </div>
  )
}
