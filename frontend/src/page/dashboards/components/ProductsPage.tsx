


import FormBtn from "./FormBtn";
import StartCards from "./StartCards";


export default function ProductsPage() {
  return (
    <div className="w-auto space-y-6">
      <div className="flex justify-between item ">
        <h1>Products Page</h1>
        <FormBtn />
      </div>
      <div className="w-auto">
        <StartCards />
      </div>
      
    </div>
  )
}
