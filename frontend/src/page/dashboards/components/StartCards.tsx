import { moneyDhForma } from "@/lib/utils";

export default function StartCards({products}: {products: Array<{listingPrice: number}>} ) {
    let totalInventory = 0;
    products.forEach((product : {listingPrice: number}) => {
        totalInventory += product.listingPrice;
    });
  

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
           <h1 className='text-orange-500 border-orange-100'>19</h1>
        </div>
    </div>
  )
}
