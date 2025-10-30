import { api } from "@/lib/axios";
import { Appointment } from "@/types";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const formSchema = z.object({
  age: z
    .number()
    .int({ message: "Age must be an integer" })
    .positive({ message: "Age must be a positive number" })
    .min(18, { message: "Age must be at least 18" })
    .max(99, { message: "Age must be 99 or less" }),
  // category: z.enum(["Regular", "Senior", "Pregnant", "Pwd"], {
  //   message: "Category must be one of Regular, Senior, Pregnant, PWD",
  // }),
  category: z.string().nonempty("Category is required"),
  slotId: z.string().nonempty("Slot ID is required"),
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
