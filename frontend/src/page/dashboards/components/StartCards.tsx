import  { useState, useEffect } from 'react';
import { moneyDhForma } from "@/lib/utils";

export default function StartCards({products}: {products: Array<{listingPrice: number}>} ) {
    let totalInventory = 0;
    products.forEach((product : {listingPrice: number}) => {
        totalInventory += product.listingPrice;
    });

    const [pendingMessages, setPendingMessages] = useState(0);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [errorMessages, setErrorMessages] = useState<string | null>(null); // Explicitly type errorMessages

    useEffect(() => {
        const fetchPendingMessages = async () => {
            setIsLoadingMessages(true); // Ensure loading state is true at the start of fetch
            setErrorMessages(null);    // Clear previous errors

            // --- Get the bearer token ---
            const token = localStorage.getItem('token'); // Replace 'yourAuthTokenKey' with your actual key

            if (!token) {
                // Handle case where token is not found (e.g., user not logged in)
                console.warn("No authentication token found. Cannot fetch pending messages.");
                setErrorMessages("Authentication required.");
                setIsLoadingMessages(false);
                return;
            }

            // --- Construct headers with Authorization token ---
            const headers: HeadersInit = {
                'Content-Type': 'application/json', // Good practice, though not strictly required for GET
                'Authorization': `Bearer ${token}` // Add the Bearer token
            };

            try {
                const response = await fetch('http://localhost:4000/api/notification/nbrPendingMessage', {
                    method: 'GET', // Or 'POST' if your API expects it
                    headers: headers,
                });

                if (response.status === 401) {
                    // Handle unauthorized access (e.g., token expired or invalid)
                    throw new Error("Unauthorized: Please log in again.");
                }
                if (!response.ok) {
                    const errorBody = await response.text(); // Get text for better error message
                    throw new Error(`HTTP error! status: ${response.status} - ${errorBody}`);
                }

                const data = await response.json();
                // Assuming the API returns the number directly.
                // If it's an object like { count: 19 }, use data.count
                setPendingMessages(data);
            } catch (error: any) {
                console.error("Failed to fetch pending messages:", error);
                setErrorMessages(error.message || "Failed to load messages.");
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
                <h1 className='text-red-500 border-red-100'>{errorMessages}</h1>
            ) : (
                <h1 className='text-orange-500 border-orange-100'>{pendingMessages}</h1>
            )}
        </div>
    </div>
  )
}