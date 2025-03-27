import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";

const CustomInput = ({ name, label, type = "text", placeholder, validation = {} }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <Input
        type={type}
        {...register(name, { 
          required: `${label} is required`, 
          ...validation // Spread custom validation rules
        })}
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs">{errors[name]?.message}</p>
      )}
    </div>
  );
};

export default CustomInput;
