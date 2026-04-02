import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

type ExportReportsPdfParams = {
  branchId: string;
  from?: string;
  to?: string;
};

function getDownloadFileName(contentDisposition?: string) {
  if (!contentDisposition) {
    return "reports.pdf";
  }

  const match = contentDisposition.match(/filename="([^"]+)"/i);
  return match?.[1] ?? "reports.pdf";
}

async function exportReportsPdf({
  branchId,
  from,
  to,
}: ExportReportsPdfParams): Promise<string> {
  const response = await api.get<Blob>("/api/v1/reports/export", {
    params: {
      branchId,
      ...(from && { from }),
      ...(to && { to }),
    },
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const downloadUrl = window.URL.createObjectURL(blob);
  const fileName = getDownloadFileName(response.headers["content-disposition"]);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);

  return fileName;
}

export const useExportReportsPdf = () =>
  useMutation({
    mutationFn: exportReportsPdf,
  });
