import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function AssignBrandSelect({ brands = [], onChange }) {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // To handle the search input

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

  // Filter brands based on the search term
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-sm font-medium">Assign Brands</label>

      {/* Searchable input field */}
      <input
        type="text"
        placeholder="Search for brands"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded-md p-2 mb-2"
      />

      {brands.length > 0 ? (
        <>
          <Select onValueChange={handleSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select brands" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto"> {/* Making the dropdown scrollable */}
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.name}> {/* Save brand name instead of id */}
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
                const brand = brands.find((b) => b.name === name); // Find brand by name
                return brand ? (
                  <Badge key={name} className="flex items-center px-3 py-1" onClick={() => handleRemove(name)}>
                    {brand.name}
                    <X className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500" />
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
