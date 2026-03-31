import { api } from "@/lib/axios";
import { PeakHourItem } from "@/types";
import { useQuery } from "@tanstack/react-query";

export type FormattedPeakHourItem = {
  hour: string;
  label: string;
  count: number;
};

function formatHour(hour: string): string {
  const h = parseInt(hour, 10);
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

const getAnalyticsPeakHours = async (
  branchId: string,
  days?: number,
): Promise<FormattedPeakHourItem[]> => {
  const response = await api.get<PeakHourItem[]>(
    "/api/v1/analytics/peak-hours",
    {
      params: {
        branchId,
        ...(days && { days }),
      },
    },
  );
  return response.data.map((item) => ({
    hour: item.hour,
    label: formatHour(item.hour),
    count: item.count,
  }));
};

export const useGetAnalyticsPeakHours = (branchId: string, days?: number) =>
  useQuery({
    queryKey: ["analytics-peak-hours", branchId, days],
    queryFn: () => getAnalyticsPeakHours(branchId, days),
    enabled: !!branchId,
    placeholderData: (prev) => prev,
  });
