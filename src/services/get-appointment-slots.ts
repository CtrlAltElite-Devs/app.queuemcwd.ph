import { api } from "@/lib/axios";
import { Slot } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getAppointmentSlots = (monthDayId: string): Promise<Slot[]> =>
  api.get(`/api/v1/slots/${monthDayId}`).then((res) => res.data);

export const useGetAppointmentSlots = (monthDayId: string) =>
  useQuery({
    queryKey: ["appointment-slots", monthDayId],
    queryFn: () => getAppointmentSlots(monthDayId),
  });
