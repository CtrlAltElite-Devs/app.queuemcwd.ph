import { appointmentTypeToService } from "@/constants";
import { api } from "@/lib/axios";
import { AppointmentTypeItem } from "@/types";
import { useQuery } from "@tanstack/react-query";

export type AppointmentTypeBreakdownRow = {
  appointmentType: string;
  count: number;
};

const getAnalyticsAppointmentTypeBreakdown = async (
  branchId: string,
  from?: string,
  to?: string,
): Promise<AppointmentTypeBreakdownRow[]> => {
  const response = await api.get<AppointmentTypeItem[]>(
    "/api/v1/analytics/appointment-type-breakdown",
    {
      params: {
        branchId,
        ...(from && { from }),
        ...(to && { to }),
      },
    },
  );
  return response.data.map((item) => ({
    appointmentType: appointmentTypeToService(item.appointmentType),
    count: item.count,
  }));
};

export const useGetAnalyticsAppointmentTypeBreakdown = (
  branchId: string,
  from?: string,
  to?: string,
) =>
  useQuery({
    queryKey: ["analytics-appt-type-breakdown", branchId, from, to],
    queryFn: () => getAnalyticsAppointmentTypeBreakdown(branchId, from, to),
    enabled: !!branchId,
    placeholderData: (prev) => prev,
  });
