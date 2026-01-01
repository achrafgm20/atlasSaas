import FilterPanel from "../dashboards/components/FilterPanel";
import FormBtn from "../dashboards/components/FormBtn";

import StartCards from "../dashboards/components/StartCards";



export default function ProductsPage() {
  return (
    <div className="w-auto space-y-6">
      <div className="flex justify-between item ">
        <h1>Products Page</h1>
        <FormBtn />
      </div>
      <StartCards />
      <div className="flex gap-8">
        <FilterPanel />
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-1  lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
      </div>
      
    </div>
  )
}
