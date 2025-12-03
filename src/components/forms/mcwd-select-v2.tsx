import { cn } from "@/lib/utils";
import { Control, Controller, FieldError } from "react-hook-form";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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

export default function McwdSelectV2({
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
              <Label htmlFor={name} className="mb-2 text-sm font-medium">
                {label} <span className="text-red-500">*</span>
              </Label>
            )}

            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={disabled}
            >
              <SelectTrigger
                className={cn(
                  "w-full rounded-md border p-3",
                  error && "border-red-500 focus:ring-red-400",
                  className,
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {error && <p className="text-xs text-red-500">{error.message}</p>}
          </div>
        );
      }}
    />
  );
}
