// import { Button } from "@/components/ui/button"
// import { useEffect, useState} from "react"
// import { Link, useParams } from "react-router-dom"


// export default function ProductPage() {
//     const {productId} = useParams()

//     // const [product,setProducts] = useState(null)
//     // const [loading,setLoading] = useState(false)
//     // const [error,setError] = useState(null)

//     // useEffect(() => {
//     //     const fetchProduct = async () => {
//     //         setLoading(true)
//     //         try {
//     //             const response = await fetch(`http://localhost:4000/api/product/getSellerProduct/${productId}`)
//     //             const data = await response.json()
//     //             setProducts(data)
//     //         } catch (error) {
//     //             setError(error.message)
//     //         } finally {
//     //             setLoading(false)
//     //         }
//     //     }
//     //     fetchProduct()
//     // },[productId])

// console.log(productId)

//   return (
//     <div>
//         <Button>
//             <Link to="/dashboard/products">Back to products Page</Link>
//         </Button>
//         <p>ProductPage</p>
//         <p>{productId}</p>
//     </div>
//   )
// }
import { useParams } from "react-router-dom";

export default function ProductPage() {
  const { productId } = useParams();

  console.log(productId); 
  // "507f1f77bcf86cd799439011"

  return <div>Product ID: {productId}</div>;
}