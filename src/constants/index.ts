import { formSchema } from "@/services/create-appointment";
import z from "zod";

export const branches = ["Main Office", "SM Consolation Office"];

export const services = [
  "Billing Concerns",
  "Water Supplier Issues",
  "Leak Reports",
  "Service Connection Concerns",
] as const;

export const formDefaultValues: z.infer<typeof formSchema> = {
  accountCode: "",
  contactPerson: "",
  contact: "",
  service: services[0],
};
