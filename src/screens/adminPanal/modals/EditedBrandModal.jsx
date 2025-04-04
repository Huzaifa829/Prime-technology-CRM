import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { updateBrandInFirebase } from "@/DB/firebaseFunctions";
import { updateBrandRedux } from "@/Redux-config/reducers/brandSlice";
import Swal from "sweetalert2";
import { updateUserBrandRedux } from "@/Redux-config/reducers/userSlice";

export default function EditedBrandModal({ open, onClose, brand }) {
    const [brandName, setBrandName] = useState("");
    const [oldBrandName, setOldBrandName] = useState(""); // 🔹 Store old name
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (brand) {
        setBrandName(brand.name);
        setOldBrandName(brand.name); // 🔹 Set old name when modal opens
      }
    }, [brand]);
  
    const handleUpdate = async () => {
      if (!brandName.trim()) return;
  
      try {
        await updateBrandInFirebase(brand.id, oldBrandName, brandName); 
        dispatch(updateBrandRedux({ id: brand.id, name: brandName }));
        dispatch(updateUserBrandRedux({ oldBrandName, newBrandName: brandName }));
  
        Swal.fire(
          "Success",
          `Brand updated from "${oldBrandName}" to "${brandName}"`,
          "success"
        );
  
        onClose();
      } catch (error) {
        console.error("Update failed:", error);
        setBrandName("");
        Swal.fire("Error", error.message, "error");
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  