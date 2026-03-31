"use client";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

type LoadingStateProps = {
  label?: string;
  className?: string;
  spinnerClassName?: string;
};

function LoadingState({
  label = "Loading...",
  className,
  spinnerClassName,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-32 flex-col items-center justify-center gap-3 text-center",
        className,
      )}
    >
      <Spinner className={cn("text-primary size-5", spinnerClassName)} />
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}

function LoadingValue({
  label = "Loading...",
  className,
}: Omit<LoadingStateProps, "spinnerClassName">) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Spinner className="text-primary size-4" />
      <span className="text-muted-foreground text-sm">{label}</span>
    </div>
  );
}

export { LoadingState, LoadingValue };
