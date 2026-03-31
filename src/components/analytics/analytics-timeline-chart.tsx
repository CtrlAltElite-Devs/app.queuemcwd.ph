"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { analyticsTimelineTemplate } from "@/components/analytics/analytics-shimmer-templates";
import { AppShimmer } from "@/components/ui/app-shimmer";
import { TimelineDataPoint } from "@/types";
import { format, parseISO } from "date-fns";
import { BarChart3 } from "lucide-react";
import { useMemo } from "react";

type Props = {
  data?: TimelineDataPoint[];
  isLoading: boolean;
};

const chartConfig = {
  count: {
    label: "Appointments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function AnalyticsTimelineChart({ data = [], isLoading }: Props) {
  return (
    <AppShimmer
      loading={isLoading}
      templateProps={{ data: analyticsTimelineTemplate }}
    >
      <AnalyticsTimelineChartContent data={data} />
    </AppShimmer>
  );
}

function AnalyticsTimelineChartContent({
  data = [],
}: {
  data?: TimelineDataPoint[];
}) {
  const summary = useMemo(() => {
    if (data.length === 0) return null;
    const total = data.reduce((s, d) => s + d.count, 0);
    const avg = total / data.length;
    const peak = data.reduce(
      (max, d) => (d.count > max.count ? d : max),
      data[0],
    );
    return { total, avg: avg.toFixed(1), peakDate: peak.date };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="text-primary size-4" />
          Appointment Timeline
        </CardTitle>
        <CardDescription>
          Number of appointments created per day. Taller bars indicate higher
          demand. Look for weekly patterns (e.g. dips on weekends) or unusual
          spikes that may need follow-up.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground text-sm">
              No timeline data available for this date range.
            </p>
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={data}>
                <defs>
                  <linearGradient id="fillTimeline" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-count)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-count)"
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => format(parseISO(value), "MMM d")}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  allowDecimals={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        format(parseISO(value), "MMM d, yyyy")
                      }
                    />
                  }
                />
                <Bar
                  dataKey="count"
                  fill="url(#fillTimeline)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
            {summary && (
              <p className="text-muted-foreground mt-3 text-xs">
                <span className="font-medium">{summary.total}</span> total
                across {data.length} days (avg{" "}
                <span className="font-medium">{summary.avg}</span>/day). Peak
                day:{" "}
                <span className="font-medium">
                  {format(parseISO(summary.peakDate), "MMM d, yyyy")}
                </span>
                .
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
