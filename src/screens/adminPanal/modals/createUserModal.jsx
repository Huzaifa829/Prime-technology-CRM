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
import Swal from "sweetalert2";
import { FormProvider, useForm } from "react-hook-form";
import CustomInput from "@/components/reusableComponents/CustomInput";
import AssignBrandSelect from "@/components/reusableComponents/AssignBrandSelect";
import AssignRoleSelect from "@/components/reusableComponents/AssignRoleSelect";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  getLoggedInUserUID,
  loginWithFirebase,
  signUpUser,
} from "@/DB/firebaseFunctions";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "@/Redux-config/reducers/userSlice";
import { auth } from "@/DB/firebase.config";

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
  const [CreateBtnLoading, setCreateBtnLoading] = useState(false);
  const dispatch = useDispatch();
  const loginUser = useSelector((state) => state.auth.user);
  const brands = useSelector((state) => state.brands.brands);

  const handleClose = () => {
    methods.reset();
    setAsnBrand(false);
    onClose();
  };
  const onSubmit = async (data) => {
    setCreateBtnLoading(true);

    const { userData: savedUser, error } = await signUpUser(
      data.name,
      data.email,
      data.password,
      data.role,
      data.brand
    );

    if (savedUser) {
      const { createdAt, ...serializableUser } = savedUser;
      dispatch(addUserData(serializableUser));

      const againLoginAdmin = await loginWithFirebase(
        loginUser.email,
        loginUser.password
      );

      console.log(againLoginAdmin);

      Swal.fire({
        title: "Success!",
        text: "User registered successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      handleClose(); // Close modal after successful signup
      const user = auth.currentUser;
      console.log("recent created user", serializableUser);
      getLoggedInUserUID()
        .then((uid) => {
          if (uid) {
            console.log("Logged-in User UID:", uid);
          } else {
            console.log("No user is logged in.");
          }
        })
        .catch((error) => {
          console.error("Error fetching user UID:", error);
        });
      if (user) {
        console.log("User ID current user:", user.uid);
      } else {
        console.log("No user is logged in");
      }
    } else {
      console.error("Signup Error:", error);
      alert(error); // Show error to user
    }

    setCreateBtnLoading(false);
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
              error={methods.formState.errors.role?.message}
              onChange={(value) => {
                methods.setValue("role", value);
                setAsnBrand(value === "employee");
              }}
            />
            {asnBrand ? (
              <AssignBrandSelect
                brands={brands} // Pass your global brands here
                onChange={(value) => methods.setValue("brand", value)} // Pass selected brand IDs to the parent form
              />
            ) : (
              ""
            )}
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
}
