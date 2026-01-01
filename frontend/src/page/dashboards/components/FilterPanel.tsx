import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function FilterPanel() {
  return (
    <div className="bg-white rounded-2xl w-full p-5 shadow-sm">
      <h1 className="font-bold text-2xl">Filters</h1>
      <form action="">
        <Label> Search</Label>
        <Input type="text" placeholder="Search by model, brand ...."  />
      </form>
      
    </div>
  )
}
