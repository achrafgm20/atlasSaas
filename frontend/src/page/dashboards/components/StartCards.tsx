import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { moneyDhForma } from "@/lib/utils";

export default function StartCards({products}: {products: Array<{listingPrice: number}>} ) {
    let totalInventory = 0;
    products.forEach((product : {listingPrice: number}) => {
        totalInventory += product.listingPrice;
    });

    // State to hold the number of pending messages
    const [pendingMessages, setPendingMessages] = useState(0);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [errorMessages, setErrorMessages] = useState(null);

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
        const fetchPendingMessages = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/notification/nbrPendingMessage');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Assuming the API directly returns the number, e.g., 19
                // If the API returns an object like { count: 19 }, you would use data.count
                setPendingMessages(data);
            } catch (error: any) {
                console.error("Failed to fetch pending messages:", error);
                setErrorMessages(error.message);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        fetchPendingMessages();
    }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">

        <div  className='bg-white text-xl   flex flex-col rounded-xl justify-center  items-start p-5  border-slate-100 shadow-sm'>
            <h1 className=" font-semibold text-xl">Total Products</h1>
           <h1 className='text-sky-500 border-sky-100'>{products.length}</h1>
        </div>
        <div  className='bg-white text-xl  flex flex-col rounded-xl justify-center  items-start p-5  border-slate-100 shadow-sm'>
            <h1 className=" font-semibold text-xl">Active Listings</h1>
           <h1 className='text-green-500 border-green-100'>{products.length}</h1>
        </div>
        <div  className='bg-white text-xl  flex flex-col rounded-xl justify-center  items-start p-5  border-slate-100 shadow-sm'>
            <h1 className=" font-semibold text-xl">Total Inventory Value</h1>
           <h1 className='text-sky-600 border-sky-100'>{moneyDhForma(totalInventory)}</h1>
        </div>
        <div  className='bg-white text-xl  flex flex-col rounded-xl justify-center  items-start p-5  border-slate-100 shadow-sm'>
            <h1 className=" font-semibold text-xl">Pending Message</h1>
            {isLoadingMessages ? (
                <h1 className='text-gray-500 border-gray-100'>Loading...</h1>
            ) : errorMessages ? (
                <h1 className='text-red-500 border-red-100'>Error</h1>
            ) : (
                <h1 className='text-orange-500 border-orange-100'>{pendingMessages}</h1>
            )}
        </div>
    </div>
  )
}