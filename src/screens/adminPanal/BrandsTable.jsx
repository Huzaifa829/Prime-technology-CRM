import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { deleteBrandFromFirestore, getAllBrands } from "@/DB/firebaseFunctions";
import {
  addBrands,
  deleteBrandFromRedux,
} from "@/Redux-config/reducers/brandSlice";
import { Input } from "@/components/ui/input";
import EditedBrandModal from "./modals/EditedBrandModal";
import Swal from "sweetalert2";
import { updateUserBrandsAfterDelete } from "@/Redux-config/reducers/userSlice";

export default function BrandsTable() {
  const dispatch = useDispatch();
  const brands = useSelector((state) => state.brands.brands);
  const UserRedux = useSelector(state => state.user.userData);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editModal, seteditModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const brandsPerPage = 2;

  useEffect(() => {
    const fetchBrandsData = async () => {
      setLoading(true);
      try {
        const brandsData = await getAllBrands();
        brandsData.forEach((item) => {
          dispatch(addBrands(item));
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    if (brands.length === 0) {
      fetchBrandsData();
    }
  }, [brands, dispatch]);

  // Filter brands based on search term
  const filteredBrands = brands.filter(
    (brand) =>
      brand &&
      brand.name &&
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) // Add checks for brand and brand.name
  );

  // Get current page brands
  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = filteredBrands.slice(
    indexOfFirstBrand,
    indexOfLastBrand
  );

  const totalPages = Math.ceil(filteredBrands.length / brandsPerPage);
  const handleDelete = async (id, brandName) => {
    console.log(UserRedux);
    
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
  
    if (result.isConfirmed) {
      try {
        setDeletingId(id); // ✅ Show loader
        console.log(brandName);
        
        await deleteBrandFromFirestore(id, brandName);
        
        dispatch(deleteBrandFromRedux(id)); // ✅ Redux se brand hatao
        dispatch(updateUserBrandsAfterDelete({ brandName })); // ✅ Redux me users ke brands update karo
        
        setDeletingId(null);
        Swal.fire("Deleted!", "The brand has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting brand:", error);
        setDeletingId(null);
        Swal.fire("Error", "Something went wrong!", "error");
      }
    }
  };
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Brands</h2>

        {/* Search Bar */}
        <Input
          placeholder="Search by brand name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBrands.length > 0 ? (
                currentBrands.map((brand, index) => (
                  <TableRow key={brand.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{brand.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedBrand(brand);
                            seteditModal(true);
                          }}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(brand.id,brand.name )}
                          disabled={deletingId === brand.id}
                        >
                          {deletingId === brand.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No brands found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {filteredBrands.length > brandsPerPage && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
      <EditedBrandModal
        open={editModal}
        onClose={() => seteditModal(false)}
        brand={selectedBrand}
      />
    </Card>
  );
}
