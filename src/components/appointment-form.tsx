"use client";

import {
  formSchema,
  useCreateAppointment,
} from "@/services/create-appointment";
import { Appointment, Category, Slot } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AppointmentFormProps {
  selectedSlot: Slot | null;
  onAppointmentCreated: (appointment: Appointment) => void;
}

export default function AppointmentForm({
  selectedSlot,
  onAppointmentCreated,
}: AppointmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 0,
      category: "Regular",
      slotId: selectedSlot?.id,
    },
  });

  const { control, setValue } = form;
  const age = useWatch({ control, name: "age" });

  // Automatically update category when age changes
  useEffect(() => {
    if (typeof age !== "number" || isNaN(age)) {
      setValue("category", Category.REGULAR);
      return;
    }

    if (age >= 60) setValue("category", Category.SENIOR);
    else setValue("category", Category.REGULAR);
  }, [age, setValue]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value as Category;
    setValue("category", selectedCategory);

    if (selectedCategory === Category.SENIOR && age < 60) {
      setValue("age", 60);
    } else if (selectedCategory === Category.REGULAR && age >= 60) {
      setValue("age", 59);
    }
  };

  const { mutate: createAppointment } = useCreateAppointment();

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    if (!selectedSlot) return;

    createAppointment(
      {
        ...data,
        category: data.category.toLowerCase(),
        slotId: selectedSlot.id,
      },
      {
        onSuccess: (appointment) => {
          onAppointmentCreated(appointment);
        },
        onError: (error) => {
          console.error("Failed to create appointment:", error);
        },
      },
    );
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Age Field */}
      <div className="space-y-2">
        <Label htmlFor="age">
          Age <span className="text-red-500">*</span>
        </Label>
        <Input
          id="age"
          type="number"
          min={18}
          max={99}
          {...form.register("age", {
            valueAsNumber: true,
            onBlur: (e) => {
              let value = Number(e.target.value);
              if (isNaN(value) || value < 18) value = 18;
              if (value > 99) value = 99;
              e.target.value = String(value);
              form.setValue("age", value);
            },
          })}
          onKeyDown={(e) => {
            if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onInput={(e) => {
            const input = e.target as HTMLInputElement;
            if (Number(input.value) > 99) {
              input.value = "99";
              form.setValue("age", 99);
            }
            if (input.value.length > 2) {
              input.value = input.value.slice(0, 2);
            }
          }}
          placeholder="Enter your age"
        />

        {form.formState.errors.age && (
          <p className="text-sm text-red-500">
            {form.formState.errors.age.message}
          </p>
        )}
        <p className="text-sm text-gray-500">Please enter your current age</p>
      </div>

      {/* Category Field */}
      <div className="space-y-2">
        <Label htmlFor="category">
          Category <span className="text-red-500">*</span>
        </Label>
        <select
          id="category"
          {...form.register("category", {
            onChange: (e) => {
              const selectedCategory = e.target.value as Category;

              form.setValue("category", selectedCategory);

              if (selectedCategory === Category.SENIOR && age < 60) {
                form.setValue("age", 60);
              } else if (selectedCategory === Category.REGULAR && age >= 60) {
                form.setValue("age", 18);
              }
            },
          })}
          className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <option value={Category.REGULAR}>Regular</option>
          <option value={Category.SENIOR}>Senior</option>
          <option value={Category.PREGNANT}>Pregnant</option>
          <option value={Category.PWD}>PWD</option>
        </select>

        {form.formState.errors.category && (
          <p className="text-sm text-red-500">
            {form.formState.errors.category.message}
          </p>
        )}
        <p className="text-sm text-gray-500">
          Category automatically adjusts based on age
        </p>
      </div>

      <Button type="submit" className="w-full">
        Submit Appointment
      </Button>
    </form>
  );
}
