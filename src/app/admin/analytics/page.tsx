"use client";

import { AdminPageSkeleton } from "@/components/admin-page-skeleton";
import { AnalyticsOverviewCards } from "@/components/analytics/analytics-overview-cards";
import { AnalyticsLeadTimeCard } from "@/components/analytics/analytics-lead-time-card";
import { AnalyticsTimelineChart } from "@/components/analytics/analytics-timeline-chart";
import { AnalyticsStatusBreakdownChart } from "@/components/analytics/analytics-status-breakdown-chart";
import { AnalyticsAppointmentTypeChart } from "@/components/analytics/analytics-appointment-type-chart";
import { AnalyticsPeakHoursChart } from "@/components/analytics/analytics-peak-hours-chart";
import { AnalyticsMultiSeriesChart } from "@/components/analytics/analytics-multi-series-chart";
import { AnalyticsStatusTrendChart } from "@/components/analytics/analytics-status-trend-chart";
import { AnalyticsTopUsersChart } from "@/components/analytics/analytics-top-users-chart";
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
import {
  useGetAnalyticsOverview,
  useGetAnalyticsTimeline,
  useGetAnalyticsStatusBreakdown,
  useGetAnalyticsAppointmentTypeBreakdown,
  useGetAnalyticsPeakHours,
  useGetAnalyticsStatusTrend,
  useGetAnalyticsTopUsers,
  useGetAnalyticsAvgLeadTime,
  useGetAnalyticsMultiSeries,
} from "@/services/analytics";
import { useBranchStore } from "@/stores/branch-store";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  BarChart3,
  Filter,
  CalendarRange,
  History,
} from "lucide-react";
import { useState } from "react";
import { type DateRange } from "react-day-picker";

const DAYS_OPTIONS = [
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
  { value: "60", label: "60 days" },
  { value: "90", label: "90 days" },
];

function SectionHeader({
  icon: Icon,
  title,
  description,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <div className="flex flex-col gap-1 pt-2">
      <div className="flex items-center gap-2">
        <Icon className="text-muted-foreground size-4" />
        <h2 className="text-base font-semibold">{title}</h2>
        <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wide uppercase">
          {badge}
        </span>
      </div>
      <p className="text-muted-foreground ml-6 text-xs">{description}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: today,
  });
  const [days, setDays] = useState(30);
  const { selectedBranch } = useBranchStore();
  const branchId = selectedBranch?.id || "";

  const startDate = dateRange?.from
    ? format(dateRange.from, "yyyy-MM-dd")
    : undefined;
  const endDate = dateRange?.to
    ? format(dateRange.to, "yyyy-MM-dd")
    : undefined;

  // Date-range endpoints
  const overview = useGetAnalyticsOverview(branchId, startDate, endDate);
  const timeline = useGetAnalyticsTimeline(branchId, startDate, endDate);
  const statusBreakdown = useGetAnalyticsStatusBreakdown(
    branchId,
    startDate,
    endDate,
  );
  const apptTypeBreakdown = useGetAnalyticsAppointmentTypeBreakdown(
    branchId,
    startDate,
    endDate,
  );

  // Days-lookback endpoints
  const peakHours = useGetAnalyticsPeakHours(branchId, days);
  const statusTrend = useGetAnalyticsStatusTrend(branchId, days);
  const topUsers = useGetAnalyticsTopUsers(branchId, days);
  const avgLeadTime = useGetAnalyticsAvgLeadTime(branchId, days);
  const multiSeries = useGetAnalyticsMultiSeries(branchId, days);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleReset = () => {
    setDateRange({
      from: new Date(today.getFullYear(), today.getMonth(), 1),
      to: today,
    });
    setDays(30);
  };

  const dateRangeLabel =
    startDate && endDate
      ? `${format(dateRange!.from!, "LLL dd")} - ${format(dateRange!.to!, "LLL dd, y")}`
      : "all time";

  if (!selectedBranch) {
    return <AdminPageSkeleton />;
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary dark:bg-primary/20 flex size-9 items-center justify-center rounded-lg">
            <BarChart3 className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Analytics</h1>
            <p className="text-muted-foreground text-sm">
              Appointment insights and performance metrics for{" "}
              <span className="text-primary font-medium">
                {selectedBranch.name}
              </span>
              . Use the filters below to adjust the reporting window.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="text-primary size-4" />
            Filters
          </CardTitle>
          <CardDescription>
            Two filters control different sections of this page.{" "}
            <strong>Date range</strong> affects the overview cards, timeline,
            and breakdown charts. <strong>Lookback period</strong> affects
            trends, peak hours, lead time, and top users.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarRange className="text-muted-foreground size-4" />
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
          </div>

          <div className="bg-border h-6 w-px" />

          <div className="flex items-center gap-2">
            <History className="text-muted-foreground size-4" />
            <span className="text-muted-foreground text-sm whitespace-nowrap">
              Lookback
            </span>
            <Select
              value={String(days)}
              onValueChange={(value) => setDays(Number(value))}
            >
              <SelectTrigger className="w-[110px]" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </CardContent>
      </Card>

      {/* ── Section: Date-Range Overview ── */}
      <SectionHeader
        icon={CalendarRange}
        title="Overview"
        description={`Key metrics for the selected date range (${dateRangeLabel}). Counts reflect total appointments; rates show outcomes as a percentage of completed appointments.`}
        badge="Date Range"
      />

      <AnalyticsOverviewCards
        data={overview.data}
        isLoading={overview.isLoading}
      />

      {/* Lead Time sits alongside the lookback section conceptually */}
      <SectionHeader
        icon={History}
        title="Operational Metrics"
        description={`Rolling metrics based on the last ${days} days. These help identify scheduling patterns and repeat visitors.`}
        badge={`Last ${days} days`}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <AnalyticsLeadTimeCard
          data={avgLeadTime.data}
          isLoading={avgLeadTime.isLoading}
        />
      </div>

      {/* ── Section: Date-Range Charts ── */}
      <SectionHeader
        icon={CalendarRange}
        title="Date-Range Charts"
        description={`Visual breakdowns filtered by the selected date range (${dateRangeLabel}). Adjust the calendar above to zoom in on specific periods.`}
        badge="Date Range"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsTimelineChart
          data={timeline.data}
          isLoading={timeline.isLoading}
        />
        <AnalyticsStatusBreakdownChart
          data={statusBreakdown.data}
          isLoading={statusBreakdown.isLoading}
        />
        <AnalyticsAppointmentTypeChart
          data={apptTypeBreakdown.data}
          isLoading={apptTypeBreakdown.isLoading}
        />
      </div>

      {/* ── Section: Lookback Charts ── */}
      <SectionHeader
        icon={History}
        title="Trend & Pattern Analysis"
        description={`Charts below use a rolling ${days}-day window ending today. Change the lookback selector above to widen or narrow the analysis period.`}
        badge={`Last ${days} days`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsPeakHoursChart
          data={peakHours.data}
          isLoading={peakHours.isLoading}
        />
        <div className="lg:col-span-1" />
        <div className="lg:col-span-2">
          <AnalyticsMultiSeriesChart
            data={multiSeries.data}
            isLoading={multiSeries.isLoading}
          />
        </div>
        <div className="lg:col-span-2">
          <AnalyticsStatusTrendChart
            data={statusTrend.data}
            isLoading={statusTrend.isLoading}
          />
        </div>
        <div className="lg:col-span-2">
          <AnalyticsTopUsersChart
            data={topUsers.data}
            isLoading={topUsers.isLoading}
          />
        </div>
      </div>
    </div>
  );
}
