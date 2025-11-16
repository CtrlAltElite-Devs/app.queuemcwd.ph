import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const adminLoginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type AdminLoginSchema = z.infer<typeof adminLoginSchema>;

const adminLogin = async (dto: AdminLoginSchema) => {
  const response = await api.post(`/api/v1/admin/login`, dto);
  return response.data;
};

export const useAdminLogin = () =>
  useMutation({
    mutationFn: adminLogin,
  });
