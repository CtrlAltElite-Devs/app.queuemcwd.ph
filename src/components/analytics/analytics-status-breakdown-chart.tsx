"use client";

import { useMemo } from "react";
import { LabelList, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { analyticsStatusBreakdownTemplate } from "@/components/analytics/analytics-shimmer-templates";
import { AppShimmer } from "@/components/ui/app-shimmer";
import { StatusBreakdownItem } from "@/types";
import { PieChartIcon } from "lucide-react";

type Props = {
  data?: StatusBreakdownItem[];
  isLoading: boolean;
};

const statusColors: Record<string, string> = {
  done: "var(--chart-1)",
  cancelled: "var(--chart-4)",
  noShow: "var(--chart-3)",
  pending: "var(--chart-2)",
  active: "var(--chart-5)",
  expired: "var(--chart-5)",
};

const statusLabels: Record<string, string> = {
  done: "Completed",
  cancelled: "Cancelled",
  noShow: "No Show",
  pending: "Pending",
  active: "Active",
  expired: "Expired",
};

const statusDescriptions: Record<string, string> = {
  done: "Successfully attended",
  cancelled: "Cancelled before scheduled time",
  noShow: "Customer did not appear",
  pending: "Awaiting scheduled time",
  active: "Currently in progress",
  expired: "Past scheduled time without action",
};

export function AnalyticsStatusBreakdownChart({ data = [], isLoading }: Props) {
  return (
    <AppShimmer
      loading={isLoading}
      templateProps={{ data: analyticsStatusBreakdownTemplate }}
    >
      <AnalyticsStatusBreakdownChartContent data={data} />
    </AppShimmer>
  );
}

function AnalyticsStatusBreakdownChartContent({
  data = [],
}: {
  data?: StatusBreakdownItem[];
}) {
  const chartData = data.map((item) => ({
    status: item.status,
    count: item.count,
    fill: statusColors[item.status] ?? "var(--chart-5)",
  }));

  const chartConfig = data.reduce(
    (acc, item) => {
      acc[item.status] = {
        label: statusLabels[item.status] ?? item.status,
        color: statusColors[item.status] ?? "var(--chart-5)",
      };
      return acc;
    },
    { count: { label: "Count" } } as ChartConfig,
  );

  const total = useMemo(
    () => data.reduce((sum, d) => sum + d.count, 0),
    [data],
  );

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="text-primary size-4" />
          Status Breakdown
        </CardTitle>
        <CardDescription>
          Proportion of appointments by their final status. A healthy
          distribution shows a large &quot;Completed&quot; slice with minimal
          cancellations and no-shows.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {data.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center">
            <p className="text-muted-foreground text-sm">
              No breakdown data available for this date range.
            </p>
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="count" hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={30}
                  radius={10}
                  cornerRadius={8}
                  paddingAngle={4}
                >
                  <LabelList
                    dataKey="count"
                    stroke="none"
                    fontSize={12}
                    fontWeight={500}
                    fill="currentColor"
                    formatter={(value) => String(value ?? "")}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            {/* Inline legend */}
            <div className="mt-4 space-y-1.5">
              {data.map((item) => {
                const pct =
                  total > 0 ? ((item.count / total) * 100).toFixed(1) : "0";
                return (
                  <div
                    key={item.status}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            statusColors[item.status] ?? "var(--chart-5)",
                        }}
                      />
                      <span className="font-medium">
                        {statusLabels[item.status] ?? item.status}
                      </span>
                      <span className="text-muted-foreground">
                        {statusDescriptions[item.status] ?? ""}
                      </span>
                    </div>
                    <span className="text-muted-foreground tabular-nums">
                      {item.count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
