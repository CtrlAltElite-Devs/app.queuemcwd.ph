"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Service } from "@/constants";
import { useGetReports } from "@/services/get-reports";
import { useBranchStore } from "@/stores/branch-store";
import { ReportRecord } from "@/types";
import { format } from "date-fns";
import { CalendarRange, FileText, TableProperties } from "lucide-react";
import { useMemo, useState } from "react";

function toDateInputValue(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function formatDateTime(value: string) {
  return format(new Date(value), "MMM d, yyyy h:mm a");
}

function isWithinRange(
  record: ReportRecord,
  startDate: string,
  endDate: string,
) {
  const scheduledTime = new Date(record.scheduledAt).getTime();

  if (startDate) {
    const startTime = new Date(`${startDate}T00:00:00`).getTime();
    if (scheduledTime < startTime) {
      return false;
    }
  }

  if (endDate) {
    const endTime = new Date(`${endDate}T23:59:59.999`).getTime();
    if (scheduledTime > endTime) {
      return false;
    }
  }

  return true;
}

export default function ReportsPage() {
  const today = new Date();
  const [startDate, setStartDate] = useState(
    toDateInputValue(new Date(today.getFullYear(), today.getMonth(), 1)),
  );
  const [endDate, setEndDate] = useState(toDateInputValue(today));
  const { selectedBranch } = useBranchStore();
  const branchId = selectedBranch?.id || "";
  const { data: reports = [], isLoading, isFetching } = useGetReports(branchId);

  const filteredReports = useMemo(
    () => reports.filter((record) => isWithinRange(record, startDate, endDate)),
    [reports, startDate, endDate],
  );

  const summaryRows = useMemo(() => {
    const counts = Object.values(Service).map((requestType) => ({
      requestType,
      count: filteredReports.filter(
        (record) => record.requestType === requestType,
      ).length,
    }));

    return counts;
  }, [filteredReports]);

  const totalCount = filteredReports.length;

  const handleResetDateRange = () => {
    setStartDate(
      toDateInputValue(new Date(today.getFullYear(), today.getMonth(), 1)),
    );
    setEndDate(toDateInputValue(today));
  };

  if (!selectedBranch) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>
            Select a branch from the admin sidebar to view branch reports.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <FileText className="size-5" />
          <div>
            <h1 className="text-2xl font-semibold">Reports</h1>
            <p className="text-muted-foreground text-sm">
              Summary and detail records for{" "}
              <span className="font-medium">{selectedBranch.name}</span>.
            </p>
          </div>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarRange className="size-4" />
            Date Range
          </CardTitle>
          <CardDescription>
            Filter the report summary and details by the selected date range.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="grid flex-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <Input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <Input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </div>
          </div>
          <Button variant="outline" onClick={handleResetDateRange}>
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TableProperties className="size-4" />
              Details
            </CardTitle>
            <CardDescription>
              Request type counts for the selected date range.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr className="border-b">
                    <th className="px-4 py-3 font-medium">Request type</th>
                    <th className="px-4 py-3 text-right font-medium">Counts</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? [...Array(4)].map((_, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="px-4 py-3">
                            <Skeleton className="h-4 w-32" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end">
                              <Skeleton className="h-4 w-10" />
                            </div>
                          </td>
                        </tr>
                      ))
                    : summaryRows.map((row) => (
                        <tr
                          key={row.requestType}
                          className="border-b last:border-0"
                        >
                          <td className="px-4 py-3">{row.requestType}</td>
                          <td className="px-4 py-3 text-right font-medium">
                            {row.count}
                          </td>
                        </tr>
                      ))}
                </tbody>
                <tfoot className="bg-muted/40">
                  <tr>
                    <td className="px-4 py-3 font-semibold">Total</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {isLoading ? "-" : totalCount}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="text-muted-foreground text-xs">
              {isFetching
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
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-medium">
                      Name / Contact Person
                    </th>
                    <th className="px-4 py-3 font-medium">Act No</th>
                    <th className="px-4 py-3 font-medium">Date Time</th>
                    <th className="px-4 py-3 font-medium">Ref #</th>
                    <th className="px-4 py-3 font-medium">Request Type</th>
                    <th className="px-4 py-3 font-medium">Cellphone #</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    [...Array(6)].map((_, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-36" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-40" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-28" />
                        </td>
                      </tr>
                    ))
                  ) : filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <tr key={report.id} className="border-b last:border-0">
                        <td className="px-4 py-3 font-medium">
                          {report.contactPerson}
                        </td>
                        <td className="px-4 py-3">{report.accountNumber}</td>
                        <td className="px-4 py-3">
                          {formatDateTime(report.scheduledAt)}
                        </td>
                        <td className="px-4 py-3">{report.referenceNumber}</td>
                        <td className="px-4 py-3">{report.requestType}</td>
                        <td className="px-4 py-3">{report.cellphoneNumber}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-muted-foreground px-4 py-10 text-center"
                      >
                        No report data found for this branch and date range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
