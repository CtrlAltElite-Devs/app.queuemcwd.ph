import { api } from "@/lib/axios";
import { MultiSeriesDataPoint } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getAnalyticsMultiSeries = async (
  branchId: string,
  days?: number,
): Promise<MultiSeriesDataPoint[]> => {
  const response = await api.get<MultiSeriesDataPoint[]>(
    "/api/v1/analytics/multi-series-statuses",
    {
      params: {
        branchId,
        ...(days && { days }),
      },
    },
  );
  return response.data;
};

export const useGetAnalyticsMultiSeries = (branchId: string, days?: number) =>
  useQuery({
    queryKey: ["analytics-multi-series", branchId, days],
    queryFn: () => getAnalyticsMultiSeries(branchId, days),
    enabled: !!branchId,
    placeholderData: (prev) => prev,
  });
