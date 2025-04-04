import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function AssignBrandSelect({ brands = [], onChange }) {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Handle search

  const handleSelect = (brandName) => {
    setSelectedBrands((prevSelected) => {
      let updatedSelection;
      if (prevSelected.includes(brandName)) {
        updatedSelection = prevSelected.filter((name) => name !== brandName);
      } else {
        updatedSelection = [...prevSelected, brandName];
      }
      onChange(updatedSelection);
      return updatedSelection;
    });
  };

  const handleRemove = (brandName) => {
    setSelectedBrands((prevSelected) => {
      const updatedSelection = prevSelected.filter((name) => name !== brandName);
      onChange(updatedSelection);
      return updatedSelection;
    });
  };

  // Filter brands based on search term
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-sm font-medium">Assign Brands</label>

      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-full flex items-center space-x-2">
          <SelectValue placeholder="Search & select brands" />
        </SelectTrigger>

        <SelectContent className="max-h-60 overflow-y-auto">
          {/* Search input inside dropdown */}
          <div className="p-2">
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-md p-2"
            />
          </div>

          {filteredBrands.length > 0 ? (
            filteredBrands.map((brand) => (
              <SelectItem key={brand.id} value={brand.name}>
                {brand.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem disabled>No brands found</SelectItem>
          )}
        </SelectContent>
      </Select>

      {/* Display selected brands */}
      {selectedBrands.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedBrands.map((name) => {
            const brand = brands.find((b) => b.name === name);
            return brand ? (
              <Badge key={name} onClick={() => handleRemove(name)} className="flex items-center px-3 py-1">
                {brand.name}
                <X className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500"  />
              </Badge>
            ) : null;
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No brand selected</p>
      )}
    </div>
  );
}
