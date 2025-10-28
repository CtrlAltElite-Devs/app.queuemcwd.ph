"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const formSchema = z.object({
  age: z
    .number()
    .int({ message: "Age must be an integer" })
    .positive({ message: "Age must be a positive number" })
    .min(18, { message: "Age must be at least 18" })
    .max(99, { message: "Age must be 99 or less" }),
  category: z.enum(["Regular", "Senior", "Pregnant", "PWD"], {
    message: "Category must be one of Regular, Senior, Pregnant, PWD",
  }),
});

export default function AppointmentForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 0,
      category: "Regular",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Age Field */}
      <div className="space-y-2">
        <Label htmlFor="age">Age *</Label>
        <Input
          id="age"
          type="number"
          {...form.register("age", {
            valueAsNumber: true,
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
          <option value="Regular">Regular</option>
          <option value="Senior">Senior</option>
          <option value="Pregnant">Pregnant</option>
          <option value="PWD">PWD</option>
        </select>
        {form.formState.errors.category && (
          <p className="text-sm text-red-500">
            {form.formState.errors.category.message}
          </p>
        )}
        <p className="text-sm text-gray-500">
          Select your appointment category
        </p>
      </div>

      <Button type="submit" className="w-full">
        Submit Appointment
      </Button>
    </form>
  );
}
