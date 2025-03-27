import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomInput from "@/components/reusableComponents/CustomInput";
import Swal from "sweetalert2";
import { loginWithFirebase } from "@/DB/firebaseFunctions";

const LoginPage = () => {
  const methods = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      await loginWithFirebase(data.email, data.password);
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Redirecting to dashboard...",
        timer: 2000,
        showConfirmButton: false,
      });
      setLoading(false);

      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "Please check your email and password or contact your admin.",
        });
        setLoading(false);
      
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg p-6 bg-white rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-600">
            Prime Technologies CRM Software
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleLogin)} className="space-y-4">
              <CustomInput name="email" label="Email" type="email" placeholder="Enter your email" />
              <CustomInput name="password" label="Password" type="password" placeholder="Enter your password" />
              

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center">
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
