"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiSeriesDataPoint } from "@/types";
import { format, parseISO } from "date-fns";
import { TrendingUp } from "lucide-react";

type Props = {
  data?: MultiSeriesDataPoint[];
  isLoading: boolean;
};

const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--chart-1)",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--chart-4)",
  },
  noShow: {
    label: "No Show",
    color: "var(--chart-3)",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function AnalyticsMultiSeriesChart({ data = [], isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="text-primary size-4" />
          Status Trends (Multi-Series)
        </CardTitle>
        <CardDescription>
          Each line tracks a different appointment outcome over time. Solid
          lines represent <strong>Completed</strong> and{" "}
          <strong>Pending</strong>; dashed lines represent{" "}
          <strong>Cancelled</strong> and <strong>No Show</strong>. Widening gaps
          between the completed line and others suggest improving service
          delivery.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[350px] w-full" />
        ) : data.length === 0 ? (
          <div className="flex h-[350px] items-center justify-center">
            <p className="text-muted-foreground text-sm">
              No multi-series data available.
            </p>
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <LineChart
                accessibilityLayer
                data={data}
                margin={{ left: 12, right: 12 }}
              >
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
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  dataKey="completed"
                  type="linear"
                  stroke="var(--color-completed)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="cancelled"
                  type="linear"
                  stroke="var(--color-cancelled)"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="4 4"
                />
                <Line
                  dataKey="noShow"
                  type="linear"
                  stroke="var(--color-noShow)"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="4 4"
                />
                <Line
                  dataKey="pending"
                  type="linear"
                  stroke="var(--color-pending)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
            <p className="text-muted-foreground mt-3 text-xs">
              Hover over the chart to see exact counts for each status on a
              given day. Solid lines = positive outcomes, dashed = negative
              outcomes.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
