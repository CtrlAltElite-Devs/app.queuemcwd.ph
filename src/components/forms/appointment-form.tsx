"use client";

import { Service } from "@/constants";
import {
  formDefaultValues,
  formSchema,
  useCreateAppointment,
} from "@/services/create-appointment";
import { Appointment, Slot } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
  const { mutate: createAppointment, isPending } = useCreateAppointment();

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    if (!selectedSlot) return;

    createAppointment(
      { ...data, slotId: selectedSlot.id },
      {
        onSuccess: (appointment) => {
          onAppointmentCreated(appointment);
        },
        onError: (error: unknown) => {
          const err = error as AxiosError<{ message?: string }>;
          const message =
            err.response?.data?.message ||
            (error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.");

          toast.error(message);
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
        numeric
        maxLength={20}
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
        numeric
        maxLength={11}
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
      <Button
        type="submit"
        className="flex w-full items-center justify-center gap-2 hover:cursor-pointer"
        disabled={isPending}
      >
        {isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}
        {isPending ? "Submitting..." : "Submit Appointment"}
      </Button>
    </form>
  );
}
