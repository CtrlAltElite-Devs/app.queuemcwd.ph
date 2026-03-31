"use client";

import {
  shimmerReportsTemplate,
  shimmerSummaryTemplateRows,
  shimmerSummaryTemplateTotal,
} from "@/components/shimmer-templates";
import { AppShimmer } from "@/components/ui/app-shimmer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingState } from "@/components/ui/loading-state";
import { Service } from "@/constants";
import { useGetReportSummary } from "@/services/get-report-summary";
import { useGetReports } from "@/services/get-reports";
import { ReportRecord } from "@/types";
import { useBranchStore } from "@/stores/branch-store";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FileText,
  TableProperties,
} from "lucide-react";
import { useMemo, useState } from "react";
import { type DateRange } from "react-day-picker";

const serviceStyles: Record<string, string> = {
  [Service.BILLING_CONCERNS]:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  [Service.WATER_SUPPLIER_ISSUES]:
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  [Service.LEAK_REPORTS]:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  [Service.SERVICE_CONNECTION_CONCERNS]:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
};

function ServiceBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        serviceStyles[type] ?? "bg-muted text-muted-foreground",
      )}
    >
      {type}
    </span>
  );
}

function formatDateTime(value: string) {
  return format(new Date(value), "MMM d, yyyy h:mm a");
}

function ReportsSummaryTable({
  summaryRows,
  totalCount,
}: {
  summaryRows: { requestType: string; count: number }[];
  totalCount: number;
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left">
          <tr className="border-b">
            <th className="px-3 py-2.5 text-xs font-medium">Request type</th>
            <th className="px-3 py-2.5 text-right text-xs font-medium">
              Counts
            </th>
          </tr>
        </thead>
        <tbody>
          {summaryRows.map((row) => (
            <tr key={row.requestType} className="border-b last:border-0">
              <td className="px-3 py-2.5">
                <ServiceBadge type={row.requestType} />
              </td>
              <td className="px-3 py-2.5 text-right font-medium tabular-nums">
                {row.count}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-muted/40">
          <tr>
            <td className="px-3 py-2.5 text-sm font-semibold">Total</td>
            <td className="px-3 py-2.5 text-right text-sm font-semibold tabular-nums">
              {totalCount}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function ReportsDetailTable({ reports }: { reports: ReportRecord[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[760px] text-sm">
        <thead className="bg-muted/50">
          <tr className="border-b text-left">
            <th className="px-4 py-3 font-medium">Name / Contact Person</th>
            <th className="px-4 py-3 font-medium">Act No</th>
            <th className="px-4 py-3 font-medium">Date Time</th>
            <th className="px-4 py-3 font-medium">Ref #</th>
            <th className="px-4 py-3 font-medium">Request Type</th>
            <th className="px-4 py-3 font-medium">Cellphone #</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report) => (
              <tr key={report.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">
                  {report.contactPerson}
                </td>
                <td className="px-4 py-3">{report.accountNumber}</td>
                <td className="px-4 py-3">
                  {formatDateTime(report.scheduledAt)}
                </td>
                <td className="px-4 py-3">{report.referenceNumber}</td>
                <td className="px-4 py-3">
                  <ServiceBadge type={report.requestType} />
                </td>
                <td className="px-4 py-3">{report.cellphoneNumber}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-primary/10 dark:bg-primary/15 flex size-10 items-center justify-center rounded-full">
                    <FileText className="text-primary/60 size-5" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    No report data found for this branch and date range.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function ReportsPage() {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: today,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { selectedBranch } = useBranchStore();
  const branchId = selectedBranch?.id || "";

  const startDate = dateRange?.from
    ? format(dateRange.from, "yyyy-MM-dd")
    : undefined;
  const endDate = dateRange?.to
    ? format(dateRange.to, "yyyy-MM-dd")
    : undefined;

  const { data, isLoading } = useGetReports(
    branchId,
    startDate,
    endDate,
    page,
    limit,
  );

  const reports = data?.data ?? [];
  const meta = data?.meta;
  const {
    data: summaryData = [],
    isLoading: isSummaryLoading,
    isFetching: isSummaryFetching,
  } = useGetReportSummary(branchId, startDate, endDate);

  const summaryRows = useMemo(() => {
    const countMap = new Map(
      summaryData.map((row) => [row.requestType, row.count]),
    );
    return Object.values(Service).map((requestType) => ({
      requestType,
      count: countMap.get(requestType) ?? 0,
    }));
  }, [summaryData]);

  const totalCount = summaryRows.reduce((sum, row) => sum + row.count, 0);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setPage(1);
  };

  const handleResetDateRange = () => {
    setDateRange({
      from: new Date(today.getFullYear(), today.getMonth(), 1),
      to: today,
    });
    setPage(1);
  };

  if (!selectedBranch) {
    return <LoadingState label="Loading reports..." className="min-h-[40vh]" />;
  }

  return (
    <div className="space-y-6 pb-6">
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary dark:bg-primary/20 flex size-9 items-center justify-center rounded-lg">
            <FileText className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Reports</h1>
            <p className="text-muted-foreground text-sm">
              Summary and detail records for{" "}
              <span className="text-primary font-medium">
                {selectedBranch.name}
              </span>
              .
            </p>
          </div>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="text-primary size-4" />
            Date Range
          </CardTitle>
          <CardDescription>
            Filter the report summary and details by the selected date range.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start px-2.5 font-normal",
                  !dateRange && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="size-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" onClick={handleResetDateRange}>
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="h-fit xl:sticky xl:top-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TableProperties className="text-primary size-4" />
              Details
            </CardTitle>
            <CardDescription>
              Request type counts for the selected date range.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AppShimmer
              loading={isSummaryLoading}
              templateProps={{
                summaryRows: shimmerSummaryTemplateRows,
                totalCount: shimmerSummaryTemplateTotal,
              }}
            >
              <ReportsSummaryTable
                summaryRows={summaryRows}
                totalCount={totalCount}
              />
            </AppShimmer>
            <p className="text-muted-foreground text-xs">
              {isSummaryFetching
                ? "Refreshing data..."
                : "Showing records for the selected branch only."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Reports</CardTitle>
            <CardDescription>
              Name/contact person, act no, date time, ref #, request type, and
              cellphone #.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppShimmer
              loading={isLoading}
              templateProps={{ reports: shimmerReportsTemplate }}
            >
              <ReportsDetailTable reports={reports} />
            </AppShimmer>
            {meta && (
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground text-sm whitespace-nowrap">
                    Rows per page
                  </p>
                  <Select
                    value={String(limit)}
                    onValueChange={(value) => {
                      setLimit(Number(value));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground text-sm">
                    Page {meta.page} of {meta.totalPages} ({meta.total} records)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
