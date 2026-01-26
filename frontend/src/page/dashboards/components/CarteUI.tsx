import { Eye, Laptop, Pencil, Smartphone, Trash , BatteryCharging} from 'lucide-react'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useNavigate } from 'react-router-dom'
import { moneyDhForma } from '@/lib/utils'


interface Product {
  _id: string
  productName: string
  condition: string
  category: string
  storage: string
  color: string
  battery: string
  listingPrice: number
  images?: { url: string }[]
}

export default function CarteUI({ product, onDelete }: { product: Product, onDelete?: (id: string) => void }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  const gradeClass = 
    product.condition === "Brand New" ? "bg-yellow-400 text-white" :
    product.condition === "Grade A"     ? "bg-green-500 text-white" :
    product.condition === "Grade B"     ? "bg-blue-400 text-black" :
    product.condition === "Fair"       ? "bg-gray-500 text-white" :
    "bg-gray-200 text-black"
    
  const ProductCategory = ({ category }: { category: string }) => {
    switch (category.toLowerCase()) {
      case "phone":
        return <Smartphone size={20} className="mr-1" />
      case "laptop":
        return <Laptop size={20} className="mr-1" />
      default:
        return null
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        
        setIsDeleting(false)
        return
      }

      const response = await fetch(`http://localhost:4000/api/product/deleteProduct/${product._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete(product._id)
      }
      setShowDeleteDialog(false)
    } catch (error: unknown) {
      console.log(error.message)
    } finally {
      setIsDeleting(false)
    }
    navigate('/dashboard/seller')
  }
  
const handEdite = async () => {
  console.log("Edit product");
}



  return (
    <>
      <div className="flex flex-col justify-between  p-2 shadow-md bg-white hover:shadow-xl rounded-xl">
        <div className='relative'>
          <div className='flex justify-center items-center h-64 w-full bg-gray-50 rounded-lg overflow-hidden'>
            <img 
              src={product.images?.[0]?.url || "/fallback.jpg"} 
              alt={product.productName} 
              className="h-full w-full object-contain" 
            />
          </div>
            
          <span className='absolute top-4 right-3'>
            <p className={`capitalize px-3 py-1 rounded-full font-semibold ${gradeClass}`}>
              {product.condition}
            </p>
          </span>
        </div>

        <div>
          <h2 className='font-semibold text-md capitalize'>{product.productName}</h2>
          
          <div className='flex justify-around font-light border-b-2 py-2'>
            <ProductCategory category={product.category} />
            <p>{product.storage}</p>
            <p className="capitalize">{product.color}</p>
            <p className='flex gap-1'>{product.battery}<BatteryCharging /></p>
          </div>
          
          {/* Price Section */}
          <div className='py-2 flex justify-around items-center'>
            <p className='text-gray-600 text-sm'>Selling Price</p>
            <p className='text-blue-600 text-2xl'>{moneyDhForma(product.listingPrice)} </p>
          </div>
          
          {/* Action Buttons */}
          <div className='flex gap-2 pt-2'>
            <button 
              onClick={()=> navigate(`/dashboard/ProductPageSeller/${product._id}`)}
              className='flex-1 flex items-center justify-center gap-2 bg-blue-50 cursor-pointer text-blue-600 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-colors duration-200'
              aria-label="View product"
            >
              <Eye size={18} />
              <span className='hidden xl:inline text-sm'>View</span>
            </button>
            <button 
              onClick={() => handEdite()}
              className='flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors duration-200'
              aria-label="Edit product"
            >
              <Pencil size={18} />
              <span className='hidden xl:inline text-sm'>Edit</span>
            </button>
            <button 
              onClick={() => setShowDeleteDialog(true)}
              className='cursor-pointer flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-colors duration-200'
              aria-label="Delete product"
            >
              <Trash size={18} />
              <span className='hidden xl:inline text-sm'>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              <span className="font-semibold"> "{product.productName}"</span> from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}