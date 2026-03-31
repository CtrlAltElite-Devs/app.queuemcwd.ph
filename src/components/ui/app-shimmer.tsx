"use client";

import { Shimmer, type ShimmerProps } from "shimmer-from-structure";

type AppShimmerProps = Omit<
  ShimmerProps,
  "duration" | "fallbackBorderRadius" | "shimmerColor" | "backgroundColor"
>;

function AppShimmer(props: AppShimmerProps) {
  return (
    <Shimmer
      duration={1.6}
      fallbackBorderRadius={12}
      shimmerColor="var(--shimmer-highlight)"
      backgroundColor="var(--shimmer-base)"
      {...props}
    />
  );
}

export { AppShimmer };
