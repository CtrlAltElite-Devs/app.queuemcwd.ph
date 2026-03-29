import { Service } from "@/constants";
import { ReportRecord } from "@/types";
import { useQuery } from "@tanstack/react-query";

const reportContacts = [
  {
    contactPerson: "Maria Santos",
    accountNumber: "10239841",
    cellphoneNumber: "09171234567",
  },
  {
    contactPerson: "John Dela Cruz",
    accountNumber: "55310892",
    cellphoneNumber: "09182345678",
  },
  {
    contactPerson: "Ana Villanueva",
    accountNumber: "44008761",
    cellphoneNumber: "09193456789",
  },
  {
    contactPerson: "Rogelio Ramos",
    accountNumber: "22894510",
    cellphoneNumber: "09204567891",
  },
  {
    contactPerson: "Cynthia Garcia",
    accountNumber: "88776124",
    cellphoneNumber: "09215678912",
  },
  {
    contactPerson: "Paolo Mendoza",
    accountNumber: "77653014",
    cellphoneNumber: "09226789123",
  },
  {
    contactPerson: "Leah Fernandez",
    accountNumber: "66340219",
    cellphoneNumber: "09237891234",
  },
  {
    contactPerson: "Victor Lim",
    accountNumber: "98120374",
    cellphoneNumber: "09248912345",
  },
];

const reportDates = [
  "2026-03-01T08:15:00+08:00",
  "2026-03-03T09:30:00+08:00",
  "2026-03-05T10:45:00+08:00",
  "2026-03-09T11:10:00+08:00",
  "2026-03-12T13:20:00+08:00",
  "2026-03-15T14:35:00+08:00",
  "2026-03-18T15:05:00+08:00",
  "2026-03-21T08:50:00+08:00",
  "2026-03-24T09:40:00+08:00",
  "2026-03-26T10:25:00+08:00",
  "2026-03-28T13:45:00+08:00",
  "2026-03-30T16:00:00+08:00",
];

const reportRequestTypes = Object.values(Service);

function getSeed(branchId: string) {
  return branchId
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);
}

function buildDummyReports(branchId: string): ReportRecord[] {
  const seed = getSeed(branchId || "default-branch");

  return reportDates.map((scheduledAt, index) => {
    const contact = reportContacts[(index + seed) % reportContacts.length];
    const requestType =
      reportRequestTypes[(index + seed) % reportRequestTypes.length];
    const referenceSuffix = String(1000 + ((seed + index) % 9000));

    return {
      id: `${branchId}-${index + 1}`,
      branchId,
      contactPerson: contact.contactPerson,
      accountNumber: contact.accountNumber,
      referenceNumber: `REF-${referenceSuffix}`,
      requestType,
      cellphoneNumber: contact.cellphoneNumber,
      scheduledAt,
    };
  });
}

const getReports = async (branchId: string): Promise<ReportRecord[]> => {
  if (!branchId) {
    return [];
  }

  return buildDummyReports(branchId);
};

export const useGetReports = (branchId: string) =>
  useQuery({
    queryKey: ["admin-reports", branchId],
    queryFn: () => getReports(branchId),
    enabled: !!branchId,
  });
