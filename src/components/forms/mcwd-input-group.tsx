import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Control, Controller } from "react-hook-form";
import { IconType } from "react-icons/lib";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

type McwdInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  type?: string;
  disabled?: boolean;
  className?: string;
  icon: LucideIcon | IconType;
};

export default function McwdInputGroup({
  name,
  label,
  placeholder,
  control,
  type = "text",
  disabled = false,
  className,
  icon,
}: McwdInputProps) {
  const Icon = icon;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <InputGroup>
            <InputGroupInput
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className={cn("text-sm", className)}
              required
            />
            <InputGroupAddon>
              <Icon />
            </InputGroupAddon>
          </InputGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    ></Controller>
  );
}
