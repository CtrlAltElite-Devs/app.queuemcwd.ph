"use client";

import { formDefaultValues, services } from "@/constants";
import {
  formSchema,
  useCreateAppointment,
} from "@/services/create-appointment";
import { Appointment, Slot } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import McwdInput from "./mcwd-input";

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
    defaultValues: formDefaultValues,
  });

  const { control } = form;

  const { mutate: createAppointment } = useCreateAppointment();

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    if (!selectedSlot) return;

    // createAppointment(
    //   {
    //     ...data,
    //     category: data.category.toLowerCase(),
    //     slotId: selectedSlot.id,
    //   },
    //   {
    //     onSuccess: (appointment) => {
    //       onAppointmentCreated(appointment);
    //     },
    //     onError: (error) => {
    //       console.error("Failed to create appointment:", error);
    //     },
    //   },
    // );
  };

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
      <McwdInput
        name="accountCode"
        label="Account Code"
        placeholder="Enter your account code"
        control={control}
      />
      <McwdInput
        name="contactPerson"
        label="Contact Person"
        placeholder="Enter contact person name"
        control={control}
      />
      <McwdInput
        name="contact"
        label="Contact"
        placeholder="Enter contact number or email"
        control={control}
      />

      {/* Services Person Field */}
      <div className="space-y-2">
        <Label htmlFor="category">
          Services <span className="text-red-500">*</span>
        </Label>
        <select
          id="service"
          {...form.register("service", {
            onChange: (e) => {
              const selectedService = e.target.value;
              form.setValue("service", selectedService);
            },
          })}
          className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {form.formState.errors.service && (
          <p className="text-sm text-red-500">
            {form.formState.errors.service.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Submit Appointment
      </Button>
    </form>
  );
}
