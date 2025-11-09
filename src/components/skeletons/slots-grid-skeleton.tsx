import { Skeleton } from "../ui/skeleton";

interface SlotsGridSkeletonProps {
  placeholderCount: number;
}

export default function SlotsGridSkeleton({
  placeholderCount,
}: SlotsGridSkeletonProps) {
  return (
    <div className="grid min-h-[12rem] animate-pulse grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[585px] lg:grid-cols-3">
      {Array.from({ length: placeholderCount }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-24 w-30 rounded-xl bg-gray-200 md:h-28 lg:w-34"
        />
      ))}
    </div>
  );
}
