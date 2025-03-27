import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { FormProvider, useForm } from "react-hook-form";
import CustomInput from "@/components/reusableComponents/CustomInput";
import { Loader2 } from "lucide-react";
import { createService } from "@/DB/firebaseFunctions";
import { useSelector } from "react-redux";

const CreateServiceModal = ({ open, onClose }) => {
  const methods = useForm({
    defaultValues: { service: "" },
  });

  const [CreateBtnLoading, setCreateBtnLoading] = useState(false);

  const handleClose = () => {
    methods.reset();
    onClose();
  };
  
  const onSubmit = async (data) => {
    setCreateBtnLoading(true);

    const { success, error } = await createService(data.service);

    if (success) {
      Swal.fire({
        title: "Success!",
        text: "Service registered successfully!",
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
          <DialogTitle>Create Service</DialogTitle>
          <DialogDescription>Fill in the details to create a new service.</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <CustomInput
              name="service"
              label="Service Name"
              placeholder="Enter Service name"
              validation={{
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: "Service can only contain letters and spaces",
                },
                minLength: {
                  value: 3,
                  message: "Service name must be at least 3 characters long",
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
                    <Loader2 className="animate-spin w-5 h-5 mr-2" /> Creating...
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

export default CreateServiceModal;
