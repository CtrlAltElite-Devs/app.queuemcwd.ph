"use client";

import { formSchema } from "@/services/create-appointment";
import { Category, Slot } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AppointmentFormProps {
  slot: Slot | null;
}

export default function AppointmentForm({ slot }: AppointmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 18,
      category: Category.REGULAR,
      slotId: slot?.id,
    },
  });

  const { control, setValue } = form;
  const age = useWatch({ control, name: "age" });

  // Automatically update category when age changes
  useEffect(() => {
    if (typeof age !== "number" || isNaN(age) || age < 18) {
      setValue("age", 18);
      setValue("category", Category.REGULAR);
      return;
    }

    if (age >= 60) setValue("category", Category.SENIOR);
    else setValue("category", Category.REGULAR);
  }, [age, setValue]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Submitted:", data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Age Field */}
      <div className="space-y-2">
        <Label htmlFor="age">Age *</Label>
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
            },
          })}
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
        <Label htmlFor="category">Category *</Label>
        <select
          id="category"
          {...form.register("category")}
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
