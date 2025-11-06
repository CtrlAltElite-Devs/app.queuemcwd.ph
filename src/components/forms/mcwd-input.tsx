import { cn } from "@/lib/utils"; // optional helper for merging Tailwind classes
import { Control, Controller, FieldError } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type McwdInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  type?: string;
  disabled?: boolean;
  className?: string;
};

export default function McwdInput({
  name,
  label,
  placeholder,
  control,
  type = "text",
  disabled = false,
  className,
}: McwdInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const error = fieldState.error as FieldError | undefined;

        return (
          <div className="flex flex-col gap-1">
            {label && (
              <Label htmlFor={name} className="text-sm font-medium">
                {label} <span className="text-red-500">*</span>
              </Label>
            )}

            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "focus:ring-primary rounded-md border p-3 focus:ring-2 focus:outline-none",
                error && "border-red-500 focus:ring-red-400",
                className,
              )}
              {...field}
            />

            {error && <p className="text-xs text-red-500">{error.message}</p>}
          </div>
        );
      }}
    />
  );
}
