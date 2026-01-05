import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

interface Filters {
  keyword?: string
  category?: "phone" | "laptop"
  condition?: "new" | "grade-a" | "grade-b" | "fair"
  minPrice?: number
  maxPrice?: number
}

const defaultFilters: Filters = {}

export default function FilterPanel() {
  const [localFilter, setLocalFilter] = useState<Filters>(defaultFilters)

  const handleChange = <K extends keyof Filters>(
    name: K,
    value: Filters[K]
  ) => {
    setLocalFilter((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
console.log(localFilter)
  const handleReset = () => setLocalFilter(defaultFilters)

  return (
    <div className="bg-white rounded-2xl w-full p-5 shadow-sm">
      <h1 className="font-bold text-2xl">Filters</h1>

      <form className="flex flex-wrap gap-5 items-end">
        {/* Search */}
        <div>
          <Label>Search</Label>
          <Input
            value={localFilter.keyword ?? ""}
            onChange={(e) => handleChange("keyword", e.target.value)}
            placeholder="Search by model, brand..."
          />
        </div>

        {/* Category */}
        <div>
          <Label>Category</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={localFilter.category === "phone" ? "default" : "outline"}
              onClick={() => handleChange("category", "phone")}
            >
              Phone
            </Button>
            <Button
              type="button"
              variant={localFilter.category === "laptop" ? "default" : "outline"}
              onClick={() => handleChange("category", "laptop")}
            >
              Laptop
            </Button>
          </div>
        </div>

        {/* Condition */}
        <div>
          <Label>Condition</Label>
          <Select
            value={localFilter.condition}
            onValueChange={(value) =>
              handleChange("condition", value as Filters["condition"])
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="new">Brand New</SelectItem>
                <SelectItem value="grade-a">Grade A</SelectItem>
                <SelectItem value="grade-b">Grade B</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        <div className="flex gap-2">
          <div>
            <Label>Min</Label>
            <Input
              type="number"
              value={localFilter.minPrice ?? ""}
              onChange={(e) =>
                handleChange("minPrice", Number(e.target.value))
              }
            />
          </div>

          <div>
            <Label>Max</Label>
            <Input
              type="number"
              value={localFilter.maxPrice ?? ""}
              onChange={(e) =>
                handleChange("maxPrice", Number(e.target.value))
              }
            />
          </div>
        </div>

        {/* Reset */}
        <Button variant="destructive" type="button" onClick={handleReset}>
          Reset
        </Button>
      </form>
    </div>
  )
}
