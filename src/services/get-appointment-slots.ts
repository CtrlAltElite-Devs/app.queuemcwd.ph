import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const getAppointmentSlots = (): Promise<unknown> =>
  api.get("/api/xxxx").then((res) => res.data);

export const useGetAppointmentSlots = () =>
  useQuery({
    queryKey: ["appointment-slots"],
    queryFn: () => getAppointmentSlots(),
  });
