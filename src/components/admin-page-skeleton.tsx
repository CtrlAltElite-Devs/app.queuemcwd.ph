import { Skeleton } from "@/components/ui/skeleton";

export function AdminSidebarSkeleton() {
  return (
    <div className="bg-sidebar hidden min-h-screen w-64 border-r px-3 py-4 md:flex md:flex-col">
      <div className="mb-6 flex items-center gap-3 rounded-lg border p-3">
        <Skeleton className="size-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-18" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function AdminPageSkeleton() {
  return (
    <div className="space-y-6 pb-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="rounded-xl border p-6">
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-xl border p-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>

        <div className="rounded-xl border p-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminShellSkeleton() {
  return (
    <div className="w-full font-sans dark:bg-background">
      <div className="flex min-h-screen">
        <AdminSidebarSkeleton />
        <div className="flex flex-1 flex-col gap-10">
          <header className="flex h-16 items-center gap-3 px-4">
            <Skeleton className="size-8" />
            <Skeleton className="h-4 w-40" />
          </header>
          <main className="px-4">
            <AdminPageSkeleton />
          </main>
        </div>
      </div>
    </div>
  );
}
