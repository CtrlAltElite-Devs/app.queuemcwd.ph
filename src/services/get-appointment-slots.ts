import { api } from "@/lib/axios";
import { GetSlotsResponse, Slot } from "@/types";
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

const getAppointmentSlotsV2 = (
  monthDayId: string,
  branchId: string | undefined,
): Promise<GetSlotsResponse> =>
  api
    .get(`/api/v2/branch/${branchId}/month-days/${monthDayId}/slots`)
    .then((res) => res.data);

export const useGetAppointmentSlotsV2 = (
  monthDayId: string,
  branchId: string | undefined,
) =>
  useQuery({
    queryKey: ["appointment-slots", monthDayId, branchId],
    queryFn: () => getAppointmentSlotsV2(monthDayId, branchId),
    enabled: !!branchId && !!monthDayId,
  });
