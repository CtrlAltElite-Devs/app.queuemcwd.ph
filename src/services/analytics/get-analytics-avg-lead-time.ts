import { api } from "@/lib/axios";
import { AvgLeadTimeResult } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getAnalyticsAvgLeadTime = async (
  branchId: string,
  days?: number,
): Promise<AvgLeadTimeResult> => {
  const response = await api.get<AvgLeadTimeResult>(
    "/api/v1/analytics/average-lead-time",
    {
      params: {
        branchId,
        ...(days && { days }),
      },
    },
  );
  return response.data;
};

export const useGetAnalyticsAvgLeadTime = (branchId: string, days?: number) =>
  useQuery({
    queryKey: ["analytics-avg-lead-time", branchId, days],
    queryFn: () => getAnalyticsAvgLeadTime(branchId, days),
    enabled: !!branchId,
    placeholderData: (prev) => prev,
  });
