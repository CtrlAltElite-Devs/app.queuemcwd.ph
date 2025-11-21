import { Skeleton } from "../ui/skeleton";

interface SlotsGridSkeletonProps {
  placeholderCount: number;
}

export default function SlotsGridSkeleton({
  placeholderCount,
}: SlotsGridSkeletonProps) {
  return (
    <div className="grid min-h-48 w-full animate-pulse grid-cols-2 gap-3 sm:grid-cols-3">
      {Array.from({ length: placeholderCount }).map((_, i) => (
        <div
          key={i}
          className="bg-background/40 flex min-h-16 min-w-24 flex-col items-center justify-center gap-2 rounded-2xl border p-4"
        >
          {/* time placeholder */}
          <Skeleton className="h-4 w-20 rounded-md" />

          {/* availability row */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />{" "}
            {/* icon placeholder */}
            <Skeleton className="h-4 w-12 rounded-md" />{" "}
            {/* text placeholder */}
          </div>
        </div>
      ))}
    </div>
  );
}
