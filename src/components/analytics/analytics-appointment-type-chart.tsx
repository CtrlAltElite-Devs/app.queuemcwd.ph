"use client";

import { useMemo } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentTypeBreakdownRow } from "@/services/analytics/get-analytics-appointment-type-breakdown";
import { ClipboardList } from "lucide-react";

type Props = {
  data?: AppointmentTypeBreakdownRow[];
  isLoading: boolean;
};

const chartConfig = {
  count: {
    label: "Count",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function AnalyticsAppointmentTypeChart({ data = [], isLoading }: Props) {
  const topType = useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce((max, d) => (d.count > max.count ? d : max), data[0]);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="text-primary size-4" />
          Appointment Types
        </CardTitle>
        <CardDescription>
          Volume of appointments per service category. The longest bar indicates
          the most requested service, which can inform staffing and resource
          allocation decisions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground text-sm">
              No appointment type data available for this date range.
            </p>
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart
                accessibilityLayer
                data={data}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <defs>
                  <linearGradient id="fillApptType" x1="0" y1="0" x2="1" y2="0">
                    <stop
                      offset="5%"
                      stopColor="var(--color-count)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-count)"
                      stopOpacity={0.8}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="appointmentType"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={150}
                  tickFormatter={(value) =>
                    value.length > 20 ? `${value.slice(0, 18)}...` : value
                  }
                />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="count"
                  fill="url(#fillApptType)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
            {topType && (
              <p className="text-muted-foreground mt-3 text-xs">
                Most requested:{" "}
                <span className="font-medium">{topType.appointmentType}</span>{" "}
                with <span className="font-medium">{topType.count}</span>{" "}
                appointments.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
