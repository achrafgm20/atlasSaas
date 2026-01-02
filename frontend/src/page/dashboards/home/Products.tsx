import CarteUI from "../components/CarteUI";
import FilterPanel from "../components/FilterPanel";
import FormBtn from "../components/FormBtn";

import StartCards from "../components/StartCards";


export default function ProductsPage() {
  const product = {
    battery: "100%",
    category: "phone",
    color: "red",
    condition: "grade-a",
    costPrice: "1000",
    description: "description",
    images: [], // Placeholder for the File array
    listingPrice: "1200",
    productName: "iphone 11 ",
    status: "active",
    storage: "128GB"
  };
  return (
    <div className="w-auto space-y-6  ">
      <div className="flex justify-between item ">
        <h1>Products Page</h1>
        <FormBtn />
      </div>
      <StartCards />
      <div className="flex gap-8">
        <FilterPanel />
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <CarteUI product={product} />
        <CarteUI product={product} />
        <CarteUI product={product} />
        <CarteUI product={product} />
        <CarteUI product={product} />
        <CarteUI product={product} />
        <CarteUI product={product} />
        <CarteUI product={product} />
        
      </div>
      
    </div>
  )
}
