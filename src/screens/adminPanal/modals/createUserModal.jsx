import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FormProvider, useForm } from "react-hook-form";
import CustomInput from "@/components/reusableComponents/CustomInput";
import AssignBrandSelect from "@/components/reusableComponents/AssignBrandSelect";
import AssignRoleSelect from "@/components/reusableComponents/AssignRoleSelect";
import { useState } from "react";

export default function CreateUserModal({ open, onClose }) {
  const methods = useForm({
    defaultValues: {
        name: "",
        email: "",
        password: "",
        brand: [],
        role: "", 
      },
  });
  const [asnBrand, setAsnBrand] = useState(false);
  const handleClose = () => {
    methods.reset(); // Reset form values
    setAsnBrand(false); // Reset brand selection
    onClose(); // Close the modal
  };
  const onSubmit = (data) => {
    const updatedData = {
        ...data,
        brand: Array.isArray(data.brand) ? data.brand : [], // Ensure brand is always an array
      };
    console.log("User Created:", updatedData);
    handleClose(); // Close modal after submission
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <CustomInput
              name="name"
              label="Full Name"
              placeholder="Enter full name"
            />
            <CustomInput
              name="email"
              label="Email Address"
              placeholder="Enter email"
            />
            <CustomInput
              name="password"
              label="Password"
              type="password"
              placeholder="Enter password"
            />
            <AssignRoleSelect
              name="role"
              roles={[
                { id: "admin", name: "Admin" },
                { id: "employee", name: "Employee" },
              ]}
              error={methods.formState.errors.role?.message}
              onChange={(value) => {
                
                methods.setValue("role", value);
                setAsnBrand(value === "employee"); 
              }}
            />
            {asnBrand ? (
              <AssignBrandSelect
                brands={[
                  { id: "asjd", name: "helloworld" },
                  { id: "asjd2", name: "helloworld2" },
                  { id: "asjd3", name: "helloworld3" },
                ]}
                onChange={(value) => methods.setValue("brand", value)}
              />
            ):''}
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
