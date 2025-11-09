import { cn } from "@/lib/utils";
import { Control, Controller, FieldError } from "react-hook-form";
import { Label } from "../ui/label";

type McwdSelectProps = {
  name: string;
  label?: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  options: { label: string; value: string }[];
  disabled?: boolean;
  className?: string;
};

export default function McwdSelect({
  name,
  label,
  placeholder,
  control,
  options,
  disabled = false,
  className,
}: McwdSelectProps) {
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

            <select
              id={name}
              disabled={disabled}
              className={cn(
                "focus:ring-primary rounded-md border p-3 focus:ring-2 focus:outline-none",
                error && "border-red-500 focus:ring-red-400",
                className,
              )}
              {...field}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {error && <p className="text-xs text-red-500">{error.message}</p>}
          </div>
        );
      }}
    />
  );
}
