import { api } from "@/lib/axios";
import { AppointmentResponse, PaginatedResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getBranchAppointments = async (
  branchId: string,
  date: string,
  page = 1,
  limit = 50,
): Promise<PaginatedResponse<AppointmentResponse>> => {
  const response = await api.get<PaginatedResponse<AppointmentResponse>>(
    `/api/v1/branch/${branchId}/appointments`,
    {
      params: {
        page,
        limit,
        from: `${date}T00:00:00`,
        to: `${date}T23:59:59`,
      },
    },
  );
  return response.data;
};

export const useGetBranchAppointments = (
  branchId: string,
  date?: string,
  page = 1,
  limit = 50,
) =>
  useQuery({
    queryKey: ["branch-appointments", branchId, date, page, limit],
    queryFn: () => getBranchAppointments(branchId, date!, page, limit),
    enabled: !!branchId && !!date,
    placeholderData: (prev) => prev,
  });
