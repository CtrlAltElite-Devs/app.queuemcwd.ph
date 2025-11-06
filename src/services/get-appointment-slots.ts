import { api } from "@/lib/axios";
import { Slot } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getAppointmentSlots = (
  monthDayId: string,
  branchId: string | undefined,
): Promise<Slot[]> =>
  api
    .get(`/api/v1/branch/${branchId}/month-days/${monthDayId}/slots`)
    .then((res) => res.data);

export const useGetAppointmentSlots = (
  monthDayId: string,
  branchId: string | undefined,
) =>
  useQuery({
    queryKey: ["appointment-slots", monthDayId, branchId],
    queryFn: () => getAppointmentSlots(monthDayId, branchId),
    enabled: !!branchId && !!monthDayId,
  });
