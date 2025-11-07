"use client";

import { Category, Service } from "@/constants";
import {
  formDefaultValues,
  formSchema,
  useCreateAppointment,
} from "@/services/create-appointment";
import { Appointment, Slot } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import McwdInput from "./mcwd-input";
import McwdSelect from "./mcwd-select";

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

    createAppointment(
      { ...data, slotId: selectedSlot.id },
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
      {/* Account Code */}
      <McwdInput
        name="accountCode"
        label="Account Code"
        placeholder="Enter your account code"
        control={control}
      />

      {/* Contact Person */}
      <McwdInput
        name="contactPerson"
        label="Contact Person"
        placeholder="Enter contact person name"
        control={control}
      />

      {/* Contact Number */}
      <McwdInput
        name="contact"
        label="Contact Number"
        placeholder="Enter contact number"
        control={control}
      />

      {/* Category Dropdown */}
      <McwdSelect
        name="category"
        label="Category"
        placeholder="Select category"
        control={control}
        options={Object.values(Category).map((cat) => ({
          label: cat,
          value: cat,
        }))}
      />

      {/* Appointment Type Dropdown */}
      <McwdSelect
        name="appointmentType"
        label="Service Type"
        placeholder="Select service type"
        control={control}
        options={Object.values(Service).map((srv) => ({
          label: srv,
          value: srv,
        }))}
      />

      {/* Submit Button */}
      <Button type="submit" className="w-full">
        Submit Appointment
      </Button>
    </form>
  );
}
