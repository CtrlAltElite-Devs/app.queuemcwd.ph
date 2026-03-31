import { api } from "@/lib/axios";
import { StatusBreakdownItem } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getAnalyticsStatusBreakdown = async (
  branchId: string,
  from?: string,
  to?: string,
): Promise<StatusBreakdownItem[]> => {
  const response = await api.get<StatusBreakdownItem[]>(
    "/api/v1/analytics/status-breakdown",
    {
      params: {
        branchId,
        ...(from && { from }),
        ...(to && { to }),
      },
    },
  );
  return response.data;
};

export const useGetAnalyticsStatusBreakdown = (
  branchId: string,
  from?: string,
  to?: string,
) =>
  useQuery({
    queryKey: ["analytics-status-breakdown", branchId, from, to],
    queryFn: () => getAnalyticsStatusBreakdown(branchId, from, to),
    enabled: !!branchId,
    placeholderData: (prev) => prev,
  });
