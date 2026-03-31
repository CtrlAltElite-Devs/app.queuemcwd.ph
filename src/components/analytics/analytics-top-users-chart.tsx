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
import { Skeleton } from "@/components/ui/skeleton";
import { TopUserItem } from "@/types";
import { Users } from "lucide-react";

type Props = {
  data?: TopUserItem[];
  isLoading: boolean;
};

const chartConfig = {
  count: {
    label: "Appointments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function AnalyticsTopUsersChart({ data = [], isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="text-primary size-4" />
          Top Users
        </CardTitle>
        <CardDescription>
          Account codes with the most appointment bookings during the lookback
          period, ranked from highest to lowest. Repeat visitors may benefit
          from priority scheduling or dedicated service windows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[350px] w-full" />
        ) : data.length === 0 ? (
          <div className="flex h-[350px] items-center justify-center">
            <p className="text-muted-foreground text-sm">
              No top users data available.
            </p>
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <BarChart
                accessibilityLayer
                data={data}
                layout="vertical"
                margin={{ left: 10 }}
              >
                <defs>
                  <linearGradient id="fillTopUsers" x1="0" y1="0" x2="1" y2="0">
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
                  dataKey="accountCode"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={120}
                  tickFormatter={(value) =>
                    value.length > 14 ? `${value.slice(0, 12)}...` : value
                  }
                />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="count"
                  fill="url(#fillTopUsers)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
            <p className="text-muted-foreground mt-3 text-xs">
              Showing top {data.length} accounts by booking frequency. Hover
              over a bar to see the exact appointment count for each account.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
