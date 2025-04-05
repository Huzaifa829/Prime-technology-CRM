// components/UserSettingsModal.jsx
import AssignBrandSelect from "@/components/reusableComponents/AssignBrandSelect";
import AssignRoleSelect from "@/components/reusableComponents/AssignRoleSelect";
import CustomInput from "@/components/reusableComponents/CustomInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

export default function UserSettingsModal({ open, onClose, user }) {
  const methods = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      brand: [],
      role: "",
    },
  });
  const brands = useSelector((state) => state.brands.brands);
  const onSubmit = async (data) => {
    console.log(data);
    console.log(user);
    console.log(brands);
    
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Settings</DialogTitle>
          <DialogDescription>
            Manage settings for{" "}
            <span className="font-semibold">{user?.name}</span>
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2 mt-4">
              <p>
                <strong>id:</strong> {user?.id}
              </p>
              <p>
                <strong>uid:</strong> {user?.uid}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Role:</strong> {user?.role}
              </p>
              <p>
                <strong>password:</strong> {user?.password}
              </p>
              <p>
                <strong>Brands:</strong> {user?.brand?.join(", ") || "None"}
              </p>
              <CustomInput
              name="name"
              label="Full Name"
              placeholder="Enter full name"
              validation={{
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: "Name can only contain letters and spaces",
                },
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters long",
                },
              }}
            />
            <CustomInput
              name="email"
              label="Email Address"
              placeholder="Enter email"
              validation={{
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              }}
            />
            <CustomInput
              name="password"
              label="Password"
              type="password"
              placeholder="Enter password"
              validation={{
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long.",
                },
              }}
            />
              <AssignRoleSelect
                name="role"
                roles={[
                  { id: "admin", name: "Admin" },
                  { id: "employee", name: "Employee" },
                ]}
              />
              <AssignBrandSelect
                brands={brands}
                defaultSelectedBrands={user?.brand}
                onChange={(selectedBrands) => console.log(selectedBrands)}
              />
            </div>
            <button type="onsubmit">sdasd</button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
