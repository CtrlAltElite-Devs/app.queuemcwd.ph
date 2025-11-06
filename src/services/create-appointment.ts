import { services } from "@/constants";
import { api } from "@/lib/axios";
import { Appointment } from "@/types";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const formSchema = z.object({
  accountCode: z.string().min(1, { message: "Account code is required" }),
  contactPerson: z.string().min(1, { message: "Contact person is required" }),
  contact: z
    .string()
    .min(1, { message: "Contact number is required" })
    .regex(/^[0-9+\-\s()]+$/, { message: "Invalid contact number format" }),
  service: z.enum(services),
});

export type CreateAppointmentDto = z.infer<typeof formSchema>;

const createAppointment = async (
  dto: CreateAppointmentDto,
): Promise<Appointment> => {
  const response = await api.post("/api/v1/appointments", dto);
  return response.data;
};

export const useCreateAppointment = () =>
  useMutation({
    mutationFn: createAppointment,
  });
