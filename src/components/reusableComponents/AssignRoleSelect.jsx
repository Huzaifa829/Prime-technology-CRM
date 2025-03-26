import { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function AssignRoleSelect({ name, roles, error ,onChange }) {
  const { control, setValue, getValues } = useFormContext();

  useEffect(() => {
    if (!getValues(name)) {
      setValue(name, ""); // Ensure no role is preselected
    }
  }, [setValue, getValues, name]);

  return (
    <div className="flex flex-col space-y-2 w-full">
      <label className="text-sm font-medium">Assign Role</label>

      <Controller
        name={name}
        control={control}
        rules={{ required: "Role selection is required" }}
        render={({ field }) => (
          <>
            {!field.value ? (
              <Select   onValueChange={(value) => {
                field.onChange(value);
                if (onChange) onChange(value); 
              }}
              value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2">
                <Badge className="flex items-center px-3 py-1" onClick={() => setValue(name, "")}>
                  {roles.find((r) => r.id === field.value)?.name}
                  <X className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500"  />
                </Badge>
              </div>
            )}
          </>
        )}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
