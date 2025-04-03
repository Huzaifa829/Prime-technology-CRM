import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CustomInput from "@/components/reusableComponents/CustomInput";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { createBrand } from "@/DB/firebaseFunctions"; // Importing createBrand function
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import { addBrands } from "@/Redux-config/reducers/brandSlice";

const CreateBrandModal = ({ open, onClose }) => {
  const methods = useForm({
    defaultValues: { brand: "" },
  });
  const dispatch = useDispatch();
  const [CreateBtnLoading, setCreateBtnLoading] = useState(false);

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  const onSubmit = async (data) => {
    setCreateBtnLoading(true);

    const { success, error, data: brandData } = await createBrand(data.brand); // Getting brand data
    if (brandData && brandData.createdAt) {
      brandData.createdAt = brandData.createdAt.toISOString();
    }

    console.log(brandData);

    if (success) {
      dispatch(addBrands(brandData));
      Swal.fire({
        title: "Success!",
        text: `Brand '${brandData.name}' created successfully with ID: ${brandData.id}`,
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      handleClose();
    } else {
      Swal.fire({
        title: "Error!",
        text: error || "Something went wrong!",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }

    setCreateBtnLoading(false);
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Brand</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new brand.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <CustomInput
              name="brand"
              label="Brand Name"
              placeholder="Enter Brand name"
              validation={{
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: "Brand can only contain letters and spaces",
                },
                minLength: {
                  value: 3,
                  message: "Brand name must be at least 3 characters long",
                },
              }}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={CreateBtnLoading}>
                {CreateBtnLoading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />{" "}
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBrandModal;
