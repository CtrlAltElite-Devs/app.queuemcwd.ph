import { api } from "@/lib/axios";
import { TopUserItem } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getAnalyticsTopUsers = async (
  branchId: string,
  days?: number,
  limit?: number,
): Promise<TopUserItem[]> => {
  const response = await api.get<TopUserItem[]>("/api/v1/analytics/top-users", {
    params: {
      branchId,
      ...(days && { days }),
      ...(limit && { limit }),
    },
  });
  return response.data;
};

export const useGetAnalyticsTopUsers = (
  branchId: string,
  days?: number,
  limit?: number,
) =>
  useQuery({
    queryKey: ["analytics-top-users", branchId, days, limit],
    queryFn: () => getAnalyticsTopUsers(branchId, days, limit),
    enabled: !!branchId,
    placeholderData: (prev) => prev,
  });
