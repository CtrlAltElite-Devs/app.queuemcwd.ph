import { cn } from "@/lib/utils";
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
  numeric?: boolean;
  maxLength?: number;
};

export default function McwdInput({
  name,
  label,
  placeholder,
  control,
  type = "text",
  disabled = false,
  className,
  numeric = false,
  maxLength,
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
              onChange={(e) => {
                let value = e.target.value;

                if (numeric) {
                  value = value.replace(/\D/g, "");
                }

                if (maxLength) {
                  value = value.slice(0, maxLength);
                }

                field.onChange(value);
              }}
            />

            {error && <p className="text-xs text-red-500">{error.message}</p>}
          </div>
        );
      }}
    />
  );
}
