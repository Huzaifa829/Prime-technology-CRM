import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function AssignBrandSelect({ brands = [], onChange }) {
  const [selectedBrands, setSelectedBrands] = useState([]);

  const handleSelect = (brandId) => {
    setSelectedBrands((prevSelected) => {
      let updatedSelection;
      if (prevSelected.includes(brandId)) {
        updatedSelection = prevSelected.filter((id) => id !== brandId);
      } else {
        updatedSelection = [...prevSelected, brandId];
      }
      onChange(updatedSelection);
      return updatedSelection;
    });
  };

  const handleRemove = (brandId) => {
    setSelectedBrands((prevSelected) => {
      const updatedSelection = prevSelected.filter((id) => id !== brandId);
      onChange(updatedSelection);
      return updatedSelection;
    });
  };

  return (
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-sm font-medium">Assign Brands</label>

      {brands.length > 0 ? (
        <>
          <Select onValueChange={handleSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select brands" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Selected Brands */}
          {selectedBrands.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedBrands.map((id) => {
                const brand = brands.find((b) => b.id === id);
                return brand ? (
                  <Badge key={id} className="flex items-center px-3 py-1" onClick={() => handleRemove(id)}>
                    {brand.name}
                    <X
                      className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500"
                    />
                  </Badge>
                ) : null;
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No brand selected</p>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-sm">No brand yet</p>
      )}
    </div>
  );
}
