import { appointmentTypeToService } from "@/constants";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type AppointmentTypeBreakdown = {
  appointmentType: number;
  count: number;
};

export type ReportSummaryRow = {
  requestType: string;
  count: number;
};

const getReportSummary = async (
  branchId: string,
  from?: string,
  to?: string,
): Promise<ReportSummaryRow[]> => {
  const response = await api.get<AppointmentTypeBreakdown[]>(
    "/api/v1/analytics/appointment-type-breakdown",
    {
      params: {
        branchId,
        ...(from && { from }),
        ...(to && { to }),
      },
    },
  );
  return response.data.map((row) => ({
    requestType: appointmentTypeToService(row.appointmentType),
    count: row.count,
  }));
};

export const useGetReportSummary = (
  branchId: string,
  from?: string,
  to?: string,
) =>
  useQuery({
    queryKey: ["admin-report-summary", branchId, from, to],
    queryFn: () => getReportSummary(branchId, from, to),
    enabled: !!branchId,
  });
