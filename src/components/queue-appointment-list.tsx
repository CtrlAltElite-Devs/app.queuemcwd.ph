"use client";

import { cn } from "@/lib/utils";
import { useGetBranchAppointments } from "@/services/get-branch-appointments";
import { useBranchStore } from "@/stores/branch-store";
import { AppointmentResponse, QueueStatus } from "@/types";
import { formatSlotTime } from "@/utils/slot-utils";
import {
  CalendarX2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Columns3,
  List,
  RefreshCw,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import QueueAppointmentCard, { statusConfig } from "./queue-appointment-card";
import { LoadingState } from "./ui/loading-state";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QueueAppointmentListProps {
  date?: string;
  hasDateSelected: boolean;
}

type SlotGroup = {
  slotId: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  booked: number;
  appointments: AppointmentResponse[];
};

type ViewMode = "list" | "kanban";

const KANBAN_STATUS_ORDER: QueueStatus[] = [
  QueueStatus.PENDING,
  QueueStatus.ACTIVE,
  QueueStatus.ARRIVED,
  QueueStatus.DONE,
  QueueStatus.CANCELLED,
  QueueStatus.EXPIRED,
  QueueStatus.NO_SHOW,
];

const statusDescriptions: Record<QueueStatus, string> = {
  [QueueStatus.PENDING]: "Booked but not yet called — waiting in queue",
  [QueueStatus.ACTIVE]: "Currently being served at the branch",
  [QueueStatus.ARRIVED]: "Has arrived and is present at the branch",
  [QueueStatus.DONE]: "Service completed successfully",
  [QueueStatus.CANCELLED]: "Appointment was cancelled before service",
  [QueueStatus.EXPIRED]: "Slot time passed without being served",
  [QueueStatus.NO_SHOW]: "Did not show up for their appointment",
};

type StatItem = {
  label: string;
  count: number;
  dotClass: string;
  countClass: string;
  tooltip: string;
};

function StatsBar({
  appointments,
  slotGroups,
  isPaginated,
}: {
  appointments: AppointmentResponse[];
  slotGroups: SlotGroup[];
  isPaginated: boolean;
}) {
  const counts = useMemo(() => {
    const map: Record<QueueStatus, number> = {
      [QueueStatus.PENDING]: 0,
      [QueueStatus.ACTIVE]: 0,
      [QueueStatus.ARRIVED]: 0,
      [QueueStatus.DONE]: 0,
      [QueueStatus.CANCELLED]: 0,
      [QueueStatus.EXPIRED]: 0,
      [QueueStatus.NO_SHOW]: 0,
    };
    for (const appt of appointments) {
      if (appt.queueStatus in map) map[appt.queueStatus]++;
    }
    return map;
  }, [appointments]);

  const totalCapacity = useMemo(
    () => slotGroups.reduce((sum, g) => sum + g.maxCapacity, 0),
    [slotGroups],
  );
  const totalBooked = useMemo(
    () => slotGroups.reduce((sum, g) => sum + g.booked, 0),
    [slotGroups],
  );
  const fillPct =
    totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  const stats: StatItem[] = [
    {
      label: "Pending",
      count: counts[QueueStatus.PENDING],
      dotClass: "bg-amber-500",
      countClass: "text-amber-700 dark:text-amber-400",
      tooltip: statusDescriptions[QueueStatus.PENDING],
    },
    {
      label: "Active",
      count: counts[QueueStatus.ACTIVE],
      dotClass: "bg-blue-500",
      countClass: "text-blue-700 dark:text-blue-400",
      tooltip: statusDescriptions[QueueStatus.ACTIVE],
    },
    {
      label: "Arrived",
      count: counts[QueueStatus.ARRIVED],
      dotClass: "bg-emerald-500",
      countClass: "text-emerald-700 dark:text-emerald-400",
      tooltip: statusDescriptions[QueueStatus.ARRIVED],
    },
    {
      label: "Done",
      count: counts[QueueStatus.DONE],
      dotClass: "bg-green-500",
      countClass: "text-green-700 dark:text-green-400",
      tooltip: statusDescriptions[QueueStatus.DONE],
    },
    {
      label: "Cancelled",
      count: counts[QueueStatus.CANCELLED],
      dotClass: "bg-red-500",
      countClass: "text-red-700 dark:text-red-400",
      tooltip: statusDescriptions[QueueStatus.CANCELLED],
    },
    {
      label: "Expired",
      count: counts[QueueStatus.EXPIRED],
      dotClass: "bg-gray-400",
      countClass: "text-muted-foreground",
      tooltip: statusDescriptions[QueueStatus.EXPIRED],
    },
    {
      label: "No Show",
      count: counts[QueueStatus.NO_SHOW],
      dotClass: "bg-orange-500",
      countClass: "text-orange-700 dark:text-orange-400",
      tooltip: statusDescriptions[QueueStatus.NO_SHOW],
    },
  ];

  return (
    <div className="bg-muted/30 space-y-3 rounded-lg border p-3">
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {stats.map((s) => (
          <Tooltip key={s.label}>
            <TooltipTrigger asChild>
              <div className="flex cursor-default items-center gap-1.5">
                <span className={cn("size-2 rounded-full shrink-0", s.dotClass)} />
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    s.countClass,
                  )}
                >
                  {s.count}
                </span>
                <span className="text-muted-foreground text-xs">{s.label}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">{s.tooltip}</TooltipContent>
          </Tooltip>
        ))}
        {isPaginated && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex cursor-default items-center gap-1">
                <span className="text-muted-foreground/60 text-xs">
                  (current page only)
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Status counts reflect the current page of results only
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {totalCapacity > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-default space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Slot capacity ({slotGroups.length} slot
                  {slotGroups.length !== 1 ? "s" : ""})
                </span>
                <span className="font-medium tabular-nums">
                  {totalBooked} / {totalCapacity} booked &mdash; {fillPct}%
                </span>
              </div>
              <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    fillPct >= 90
                      ? "bg-red-500"
                      : fillPct >= 70
                        ? "bg-amber-500"
                        : "bg-emerald-500",
                  )}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {totalBooked} of {totalCapacity} total capacity booked across{" "}
            {slotGroups.length} time slot{slotGroups.length !== 1 ? "s" : ""}.{" "}
            {totalCapacity - totalBooked} slot
            {totalCapacity - totalBooked !== 1 ? "s" : ""} still open.
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

function SlotHeader({ group }: { group: SlotGroup }) {
  const fillPct =
    group.maxCapacity > 0
      ? Math.round((group.booked / group.maxCapacity) * 100)
      : 0;
  const openSlots = group.maxCapacity - group.booked;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Clock className="text-primary size-4 shrink-0" />
        <h3 className="text-sm font-semibold">
          {formatSlotTime(group.startTime)} &ndash;{" "}
          {formatSlotTime(group.endTime)}
        </h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="bg-muted text-muted-foreground cursor-default rounded-full px-2 py-0.5 text-xs font-medium">
              {group.appointments.length} appointment
              {group.appointments.length !== 1 ? "s" : ""}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {group.appointments.length} appointment
            {group.appointments.length !== 1 ? "s" : ""} booked in this time
            slot
          </TooltipContent>
        </Tooltip>
      </div>
      {group.maxCapacity > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex cursor-default items-center gap-2">
              <div className="bg-muted h-1.5 w-16 overflow-hidden rounded-full">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    fillPct >= 90
                      ? "bg-red-500"
                      : fillPct >= 70
                        ? "bg-amber-500"
                        : "bg-emerald-500",
                  )}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
              <span className="text-muted-foreground text-xs tabular-nums whitespace-nowrap">
                {group.booked}/{group.maxCapacity}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {group.booked} of {group.maxCapacity} capacity booked ({fillPct}%).{" "}
            {openSlots > 0 ? `${openSlots} slot${openSlots !== 1 ? "s" : ""} still open.` : "Fully booked."}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

function KanbanBoard({
  appointments,
}: {
  appointments: AppointmentResponse[];
}) {
  const statusGroups = useMemo(() => {
    const map = new Map<QueueStatus, AppointmentResponse[]>();
    for (const appt of appointments) {
      const list = map.get(appt.queueStatus) ?? [];
      list.push(appt);
      map.set(appt.queueStatus, list);
    }
    return KANBAN_STATUS_ORDER.filter((s) => map.has(s)).map((status) => ({
      status,
      appointments: map.get(status)!,
    }));
  }, [appointments]);

  return (
    <div className="-mx-6 overflow-x-auto px-6 pb-1">
      <div className="flex gap-3">
        {statusGroups.map(({ status, appointments: appts }) => {
          const config = statusConfig[status] ?? {
            label: status,
            className: "bg-muted text-muted-foreground",
          };
          return (
            <div
              key={status}
              className="bg-muted/30 flex min-w-[280px] flex-col rounded-lg border p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className={cn(
                        "inline-flex cursor-default items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        config.className,
                      )}
                    >
                      {config.label}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {statusDescriptions[status as QueueStatus] ?? status}
                  </TooltipContent>
                </Tooltip>
                <span className="text-muted-foreground text-xs font-medium">
                  {appts.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {appts.map((appt) => (
                  <QueueAppointmentCard
                    key={appt.id}
                    appointment={appt}
                    variant="card"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function QueueAppointmentList({
  date,
  hasDateSelected,
}: QueueAppointmentListProps) {
  const { selectedBranch } = useBranchStore();
  const branchId = selectedBranch?.id ?? "";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const { data, isLoading, isFetching, refetch } = useGetBranchAppointments(
    branchId,
    date,
    page,
    limit,
  );

  const appointments = useMemo(() => data?.data ?? [], [data?.data]);
  const meta = data?.meta;
  const isPaginated = !!meta && meta.totalPages > 1;

  const slotGroups = useMemo(() => {
    const map = new Map<string, SlotGroup>();
    for (const appt of appointments) {
      const key = appt.slot.id;
      if (!map.has(key)) {
        map.set(key, {
          slotId: appt.slot.id,
          startTime: appt.slot.startTime,
          endTime: appt.slot.endTime,
          maxCapacity: Number(appt.slot.maxCapacity),
          booked: Number(appt.slot.booked),
          appointments: [],
        });
      }
      map.get(key)!.appointments.push(appt);
    }
    return Array.from(map.values())
      .map((g) => ({
        ...g,
        booked: isNaN(g.booked) ? g.appointments.length : g.booked,
      }))
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      );
  }, [appointments]);

  if (!hasDateSelected) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="bg-primary/10 dark:bg-primary/15 flex size-12 items-center justify-center rounded-full">
            <CalendarX2 className="text-primary/60 size-6" />
          </div>
          <div className="text-center">
            <p className="font-medium">No date selected</p>
            <p className="text-muted-foreground text-sm">
              Select a date from the calendar to view appointments.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-16">
          <LoadingState label="Loading appointments..." className="min-h-0" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <Users className="text-primary size-4" />
            Appointments
          </CardTitle>
          <CardDescription>
            {appointments.length === 0
              ? "No appointments found for this date."
              : `${meta?.total ?? appointments.length} appointment${(meta?.total ?? appointments.length) !== 1 ? "s" : ""} across ${slotGroups.length} slot${slotGroups.length !== 1 ? "s" : ""}.`}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-muted flex items-center rounded-md p-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon-sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>List view — grouped by time slot</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "kanban" ? "secondary" : "ghost"}
                  size="icon-sm"
                  onClick={() => setViewMode("kanban")}
                >
                  <Columns3 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Board view — grouped by status</TooltipContent>
            </Tooltip>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isFetching}
                onClick={() => refetch()}
              >
                <RefreshCw
                  className={cn("size-3.5", isFetching && "animate-spin")}
                />
                Refresh
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reload appointment data from the server</TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10">
            <div className="bg-primary/10 dark:bg-primary/15 flex size-10 items-center justify-center rounded-full">
              <CalendarX2 className="text-primary/60 size-5" />
            </div>
            <p className="text-muted-foreground text-sm">
              No appointments scheduled for this date.
            </p>
          </div>
        ) : (
          <>
            <StatsBar
              appointments={appointments}
              slotGroups={slotGroups}
              isPaginated={isPaginated}
            />
            {slotGroups.map((group) => (
              <div key={group.slotId} className="space-y-3">
                <SlotHeader group={group} />
                {viewMode === "list" ? (
                  <div className="space-y-2">
                    {group.appointments.map((appt) => (
                      <QueueAppointmentCard
                        key={appt.id}
                        appointment={appt}
                        variant="row"
                      />
                    ))}
                  </div>
                ) : (
                  <KanbanBoard appointments={group.appointments} />
                )}
              </div>
            ))}
          </>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground text-sm whitespace-nowrap">
                Rows per page
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Select
                    value={String(limit)}
                    onValueChange={(value) => {
                      setLimit(Number(value));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </TooltipTrigger>
                <TooltipContent>Number of appointments to show per page</TooltipContent>
              </Tooltip>
              <p className="text-muted-foreground text-sm">
                Page {meta.page} of {meta.totalPages} ({meta.total} records)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Go to previous page</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Go to next page</TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
