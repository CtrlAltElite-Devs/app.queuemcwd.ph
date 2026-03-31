import { appointmentTypeToService } from "@/constants";
import { api } from "@/lib/axios";
import {
  AppointmentResponse,
  PaginatedResponse,
  ReportRecord,
} from "@/types";
import { useQuery } from "@tanstack/react-query";

function mapToReportRecord(dto: AppointmentResponse): ReportRecord {
  return {
    id: dto.id,
    branchId: dto.branch.id,
    contactPerson: dto.contactPerson,
    accountNumber: dto.accountCode,
    referenceNumber: dto.appointmentCode,
    requestType: appointmentTypeToService(dto.appointmentType),
    cellphoneNumber: dto.contact,
    scheduledAt: dto.slot.startTime,
  };
}

export type PaginatedReports = {
  data: ReportRecord[];
  meta: PaginatedResponse<unknown>["meta"];
};

const getReports = async (
  branchId: string,
  from?: string,
  to?: string,
  page = 1,
  limit = 10,
): Promise<PaginatedReports> => {
  const response = await api.get<PaginatedResponse<AppointmentResponse>>(
    `/api/v1/branch/${branchId}/appointments`,
    {
      params: {
        page,
        limit,
        ...(from && { from: `${from}T00:00:00` }),
        ...(to && { to: `${to}T23:59:59` }),
      },
    },
  );
  return {
    data: response.data.data.map(mapToReportRecord),
    meta: response.data.meta,
  };
};

export const useGetReports = (
  branchId: string,
  from?: string,
  to?: string,
  page = 1,
  limit = 10,
) =>
  useQuery({
    queryKey: ["admin-reports", branchId, from, to, page, limit],
    queryFn: () => getReports(branchId, from, to, page, limit),
    enabled: !!branchId,
    placeholderData: (prev) => prev,
  });
