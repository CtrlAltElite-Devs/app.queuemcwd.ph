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

interface QueueAppointmentListProps {
  date?: string;
  hasDateSelected: boolean;
}

type SlotGroup = {
  slotId: string;
  startTime: string;
  endTime: string;
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

function SlotHeader({ group }: { group: SlotGroup }) {
  return (
    <div className="flex items-center gap-2">
      <Clock className="text-primary size-4" />
      <h3 className="text-sm font-semibold">
        {formatSlotTime(group.startTime)} &ndash;{" "}
        {formatSlotTime(group.endTime)}
      </h3>
      <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
        {group.appointments.length} appointment
        {group.appointments.length !== 1 ? "s" : ""}
      </span>
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
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    config.className,
                  )}
                >
                  {config.label}
                </span>
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

  const slotGroups = useMemo(() => {
    const map = new Map<string, SlotGroup>();
    for (const appt of appointments) {
      const key = appt.slot.id;
      if (!map.has(key)) {
        map.set(key, {
          slotId: appt.slot.id,
          startTime: appt.slot.startTime,
          endTime: appt.slot.endTime,
          appointments: [],
        });
      }
      map.get(key)!.appointments.push(appt);
    }
    return Array.from(map.values()).sort(
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
              : `${appointments.length} appointment${appointments.length !== 1 ? "s" : ""} across ${slotGroups.length} slot${slotGroups.length !== 1 ? "s" : ""}.`}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-muted flex items-center rounded-md p-0.5">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("list")}
            >
              <List className="size-4" />
            </Button>
            <Button
              variant={viewMode === "kanban" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("kanban")}
            >
              <Columns3 className="size-4" />
            </Button>
          </div>
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
          slotGroups.map((group) => (
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
          ))
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground text-sm whitespace-nowrap">
                Rows per page
              </p>
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
              <p className="text-muted-foreground text-sm">
                Page {meta.page} of {meta.totalPages} ({meta.total} records)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
