import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react"; // 👈 Import icons

const CustomInput = ({ name, label, type = "text", placeholder, validation = {} }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="flex flex-col space-y-1 relative">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative">
        <Input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          {...register(name, {
            required: `${label} is required`,
            ...validation,
          })}
          placeholder={placeholder}
        />
        {isPassword && (
          <div
            className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
          </div>
        )}
      </div>
      {errors[name] && (
        <p className="text-red-500 text-xs">{errors[name]?.message}</p>
      )}
    </div>
  );
};

export default CustomInput;
