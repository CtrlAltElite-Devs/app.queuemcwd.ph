"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
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
import { analyticsPeakHoursTemplate } from "@/components/analytics/analytics-shimmer-templates";
import { AppShimmer } from "@/components/ui/app-shimmer";
import { FormattedPeakHourItem } from "@/services/analytics/get-analytics-peak-hours";
import { Clock } from "lucide-react";

type Props = {
  data?: FormattedPeakHourItem[];
  isLoading: boolean;
};

const chartConfig = {
  count: {
    label: "Appointments",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function AnalyticsPeakHoursChart({ data = [], isLoading }: Props) {
  return (
    <AppShimmer
      loading={isLoading}
      templateProps={{ data: analyticsPeakHoursTemplate }}
    >
      <AnalyticsPeakHoursChartContent data={data} />
    </AppShimmer>
  );
}

function AnalyticsPeakHoursChartContent({
  data = [],
}: {
  data?: FormattedPeakHourItem[];
}) {
  const maxCount = useMemo(
    () => Math.max(...data.map((d) => d.count), 0),
    [data],
  );

  const peakHour = useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce((max, d) => (d.count > max.count ? d : max), data[0]);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="text-primary size-4" />
          Peak Hours
        </CardTitle>
        <CardDescription>
          When appointments are most frequently scheduled. Darker bars indicate
          higher demand. Use this to plan staff schedules and optimize slot
          availability during rush periods.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground text-sm">
              No peak hours data available.
            </p>
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={11}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  allowDecimals={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.map((entry) => (
                    <Cell
                      key={entry.hour}
                      fill="var(--color-count)"
                      fillOpacity={
                        maxCount > 0
                          ? 0.3 + (entry.count / maxCount) * 0.7
                          : 0.5
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            {peakHour && (
              <p className="text-muted-foreground mt-3 text-xs">
                Busiest hour:{" "}
                <span className="font-medium">{peakHour.label}</span> with{" "}
                <span className="font-medium">{peakHour.count}</span>{" "}
                appointments. Bar opacity scales from lightest (fewest) to
                darkest (most).
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
