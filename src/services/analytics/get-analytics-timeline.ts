import { api } from "@/lib/axios";
import { TimelineDataPoint } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getAnalyticsTimeline = async (
  branchId: string,
  from?: string,
  to?: string,
): Promise<TimelineDataPoint[]> => {
  const response = await api.get<TimelineDataPoint[]>(
    "/api/v1/analytics/timeline",
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

export const useGetAnalyticsTimeline = (
  branchId: string,
  from?: string,
  to?: string,
) =>
  useQuery({
    queryKey: ["analytics-timeline", branchId, from, to],
    queryFn: () => getAnalyticsTimeline(branchId, from, to),
    enabled: !!branchId,
    placeholderData: (prev) => prev,
  });
