import { useSlotManager } from "@/hooks/use-slot-manager";
import { useGetAppointmentSlots } from "@/services/get-appointment-slots";
import { useBranchStore } from "@/stores/branch-store";
import { Slot } from "@/types";
import { CalendarOff, Clock, Inbox, Plus } from "lucide-react";
import { useEffect, useMemo } from "react";
import SlotField from "./slot-field";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface AppointmentSlotFieldsProps {
  monthDayId: string;
  isWorkingDay?: boolean;
  hasDateSelected?: boolean;
}

export default function AppointmentSlotFields({
  monthDayId,
  isWorkingDay,
  hasDateSelected,
}: AppointmentSlotFieldsProps) {
  const { selectedBranch } = useBranchStore();
  const branchId = selectedBranch?.id || "";

  const { data: slots } = useGetAppointmentSlots(monthDayId || "", branchId);
  const {
    slots: localSlots,
    initializeSlots,
    updateSlot,
    deleteSlot,
    saveChanges,
    pendingAddedSlots,
    addPendingSlot,
    addSlotToApi,
    saveSlotChangesToApi,
    onDiscard,
    resetPendingSlot,
  } = useSlotManager(monthDayId, branchId);

  useEffect(() => {
    if (slots) {
      initializeSlots(slots);
    }
  }, [slots, initializeSlots]);

  useEffect(() => {
    resetPendingSlot();
  }, [monthDayId]);

  const hasExistingSlots = localSlots && localSlots.length > 0;
  const hasPendingSlots = pendingAddedSlots && pendingAddedSlots.length > 0;
  const shouldShowActions = hasExistingSlots || hasPendingSlots;

  const stats = useMemo(() => {
    if (!localSlots?.length) return null;
    const totalCapacity = localSlots.reduce((s, sl) => s + sl.maxCapacity, 0);
    const totalBooked = localSlots.reduce((s, sl) => s + sl.booked, 0);
    const activeSlots = localSlots.filter((sl) => sl.isActive).length;
    return {
      total: localSlots.length,
      activeSlots,
      totalCapacity,
      totalBooked,
    };
  }, [localSlots]);

  if (!hasDateSelected) {
    return (
      <Card className="flex h-fit min-h-64 flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="bg-primary/10 dark:bg-primary/15 flex size-14 items-center justify-center rounded-full">
            <CalendarOff className="text-primary/60 size-7" />
          </div>
          <div>
            <p className="text-sm font-medium">No date selected</p>
            <p className="text-muted-foreground text-xs">
              Select a date from the calendar to manage its time slots.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="text-primary size-4" />
              Appointment Slots
            </CardTitle>
            <CardDescription>
              Configure time slots and capacity for the selected date.
            </CardDescription>
          </div>
          {shouldShowActions && (
            <Button onClick={saveChanges} size="sm">
              Save Changes
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats && (
          <div className="flex flex-wrap gap-3">
            <div className="rounded-lg border border-blue-200/35 bg-blue-50/20 px-3 py-2 dark:border-blue-800/20 dark:bg-blue-950/10">
              <p className="text-xs text-blue-500/70 dark:text-blue-400/60">
                Active Slots
              </p>
              <p className="text-lg font-semibold">
                {stats.activeSlots}
                <span className="text-muted-foreground text-xs font-normal">
                  {" "}
                  / {stats.total}
                </span>
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200/35 bg-emerald-50/20 px-3 py-2 dark:border-emerald-800/20 dark:bg-emerald-950/10">
              <p className="text-xs text-emerald-500/70 dark:text-emerald-400/60">
                Total Capacity
              </p>
              <p className="text-lg font-semibold">{stats.totalCapacity}</p>
            </div>
            <div className="rounded-lg border border-violet-200/35 bg-violet-50/20 px-3 py-2 dark:border-violet-800/20 dark:bg-violet-950/10">
              <p className="text-xs text-violet-500/70 dark:text-violet-400/60">
                Booked
              </p>
              <p className="text-lg font-semibold">
                {stats.totalBooked}
                <span className="text-muted-foreground text-xs font-normal">
                  {" "}
                  / {stats.totalCapacity}
                </span>
              </p>
            </div>
          </div>
        )}

        {!isWorkingDay && hasDateSelected && (
          <div className="rounded-lg border border-amber-200/40 bg-amber-50/30 px-4 py-3 dark:border-amber-800/25 dark:bg-amber-950/10">
            <p className="text-sm font-medium text-amber-700/80 dark:text-amber-300/70">
              This is a non-working day. Slots may not be available for booking.
            </p>
          </div>
        )}

        {localSlots?.map((slot, index) => (
          <SlotField
            key={slot.id}
            slot={slot}
            index={index}
            onUpdate={(updates) => updateSlot(slot.id, updates)}
            onDelete={() => deleteSlot(slot.id)}
            allSlots={localSlots || []}
            pendingAddedSlots={pendingAddedSlots}
            onSaveChanges={saveSlotChangesToApi}
            onDiscardChanges={onDiscard}
          />
        ))}
        {pendingAddedSlots?.map((slot, index) => (
          <SlotField
            key={slot.id}
            slot={slot as Slot}
            index={index}
            onUpdate={(updates) => updateSlot(slot.id, updates)}
            onDelete={() => deleteSlot(slot.id)}
            allSlots={localSlots || []}
            pendingAddedSlots={pendingAddedSlots}
            pending
            onAddSlot={addSlotToApi}
          />
        ))}

        {!hasExistingSlots && !hasPendingSlots && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="bg-primary/10 dark:bg-primary/15 flex size-14 items-center justify-center rounded-full">
              <Inbox className="text-primary/60 size-7" />
            </div>
            <div>
              <p className="text-sm font-medium">No slots configured</p>
              <p className="text-muted-foreground text-xs">
                Add a time slot to start accepting appointments for this date.
              </p>
            </div>
            <Button onClick={() => addPendingSlot()} size="sm" className="mt-2">
              <Plus className="mr-1 size-4" />
              Add First Slot
            </Button>
          </div>
        )}

        {shouldShowActions && (
          <Button
            onClick={() => addPendingSlot()}
            variant="outline"
            className="w-full"
          >
            <Plus className="mr-1 size-4" />
            Add Slot
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
