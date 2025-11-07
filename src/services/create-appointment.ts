import { Category, Service } from "@/constants";
import { api } from "@/lib/axios";
import { Appointment } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const formSchema = z.object({
  accountCode: z.string().min(1, { message: "Account code is required" }),
  contactPerson: z.string().min(1, { message: "Contact person is required" }),
  contact: z
    .string()
    .min(1, { message: "Contact number is required" })
    .max(11, { message: "Contact number must be 11 digits" })
    .regex(/^[0-9+\-\s()]+$/, { message: "Invalid contact number format" }),
  category: z.enum(Category, "Category is required"),
  appointmentType: z.enum(Service, "Service type is required."),
});

export type CreateAppointmentDto = z.infer<typeof formSchema>;

export const formDefaultValues: CreateAppointmentDto = {
  accountCode: "",
  contactPerson: "",
  contact: "",
  category: Category.REGULAR,
  appointmentType: Service.BILLING_CONCERNS,
};

const createAppointment = async (
  dto: CreateAppointmentDto & { slotId: string },
): Promise<Appointment> => {
  const response = await api.post("/api/v1/appointments", {
    ...dto,
    // normalize casing for backend
    category: dto.category.toLowerCase(),
    appointmentType: Object.values(Service).indexOf(dto.appointmentType),
  });
  return response.data;
};

export const useCreateAppointment = () =>
  useMutation({
    mutationFn: createAppointment,
  });
