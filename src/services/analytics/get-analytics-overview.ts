import { api } from "@/lib/axios";
import { AnalyticsOverview } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getAnalyticsOverview = async (
  branchId: string,
  from?: string,
  to?: string,
): Promise<AnalyticsOverview> => {
  const response = await api.get<AnalyticsOverview>(
    "/api/v1/analytics/overview",
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

export const useGetAnalyticsOverview = (
  branchId: string,
  from?: string,
  to?: string,
) =>
  useQuery({
    queryKey: ["analytics-overview", branchId, from, to],
    queryFn: () => getAnalyticsOverview(branchId, from, to),
    enabled: !!branchId,
    placeholderData: (prev) => prev,
  });
