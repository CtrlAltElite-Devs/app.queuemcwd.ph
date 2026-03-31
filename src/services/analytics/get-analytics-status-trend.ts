import { api } from "@/lib/axios";
import { StatusTrendItem, StatusTrendWideRow } from "@/types";
import { useQuery } from "@tanstack/react-query";

function pivotStatusTrend(data: StatusTrendItem[]): StatusTrendWideRow[] {
  const map: Record<string, StatusTrendWideRow> = {};
  for (const { date, status, count } of data) {
    if (!map[date]) {
      map[date] = { date, done: 0, cancelled: 0, noShow: 0, pending: 0 };
    }
    const key = status as keyof Omit<StatusTrendWideRow, "date">;
    if (key in map[date]) {
      map[date][key] = count;
    }
  }
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
}

const getAnalyticsStatusTrend = async (
  branchId: string,
  days?: number,
): Promise<StatusTrendWideRow[]> => {
  const response = await api.get<StatusTrendItem[]>(
    "/api/v1/analytics/status-trend",
    {
      params: {
        branchId,
        ...(days && { days }),
      },
    },
  );
  return pivotStatusTrend(response.data);
};

export const useGetAnalyticsStatusTrend = (branchId: string, days?: number) =>
  useQuery({
    queryKey: ["analytics-status-trend", branchId, days],
    queryFn: () => getAnalyticsStatusTrend(branchId, days),
    enabled: !!branchId,
    placeholderData: (prev) => prev,
  });
