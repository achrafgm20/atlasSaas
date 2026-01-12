import { Button } from '@/components/ui/button'
import img from '@/assets/Capture.jpg'
import { Link, useParams } from 'react-router-dom'
import {  useEffect, useState } from 'react'
import axios from 'axios'



export default function ProductPageBuyer() {
  const [product, setProduct] = useState(null)
  
  const {id} = useParams()
 
  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:4000/api/product/getProductDetails/${id}`)
  //     .then((res) => {
  //       setProduct(res.data);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, [id]);
console.log(id)
  
  if (!product) return <p>Product not found</p>;
  
  return (
    <div className='flex flex-col w-full max-w-7xl mx-auto justify-center mb-6 pt-10  px-4 bg-[#e2edf7]'>
      <div><Button>
        <Link to="/">Go gome</Link>
        </Button>
        </div>
        <div className='flex flex-row gap-5 pt-10 m-5  '>
          <div className="flex gap-2 flex-col p-5 border-2 border-gray-200 bg-white rounded-2xl w-full h-auto justify-center ">
            <img src={img} className='w-180    cover-full'/>
            <div className='flex gap-2'>
              <img src={img}className='w-20' />
              <img src={img} className='w-20'/>
              <img src={img} className='w-20'/>
            
            </div>
            
          </div>
        <div className='flex gap-2 flex-col w-full p-5 border-2 border-gray-200 bg-white rounded-2xl  h-auto  '>
            <div>
                <h1 className='text-2xl font-bold'>iPhone 15 Pro Max</h1>
            </div>
            <div className='flex gap-2 just'>
                <div className='bg-gray-100 p-6 rounded-2xl   flex border-2 border-gray-50 flex-col w-auto flex-rol justify-center'>
                  <h2>Condition</h2>
                  <p>Grade A</p>
                </div>
                <div className='bg-gray-100 p-6 rounded-2xl   flex border-2 border-gray-50 flex-col w-auto flex-rol justify-center'>
                  <h2>COLOR</h2>
                  <p>Grade A</p>
                </div>
                <div className='bg-gray-100 p-6 rounded-2xl   flex border-2 border-gray-50 flex-col w-auto flex-rol justify-center'>
                  <h2>STORAGE</h2>
                  <p>Grade A</p>
                </div>
                <div className='bg-gray-100 p-6 rounded-2xl   flex border-2 border-gray-50 flex-col w-auto flex-rol justify-center'>
                  <h2>Battry healt</h2>
                  <p>98%</p>
                </div>
            </div>
            <div className='flex flex-col my-2'>
                <p className='text-3xl'>Total Price</p>
                <h1 className='font-semibold text-2xl text-blue-600'>$1000</h1>
            </div>
            <div className='flex bg-blue-400 rounded-md'>
               <button className='p-2  cursor-pointer '>ADD to cart</button>
            </div>
            <div className='flex flex-col p-3 bg-blue-100 border-2 mt-3 border-blue-600 rounded-md'>
              <p>12-month warranty includedProtected </p>
              <p>against defects and malfunctions</p>
            </div>
            <div className='border-t-2 border-gray-400 mt-5'>
              <p>seller</p>
            </div>
           </div>
      </div>
       
    </div>
  )
}
