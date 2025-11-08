import { useDeleteSlot } from "@/services/delete-slot";
import { useGetAppointmentSlots } from "@/services/get-appointment-slots";
import { useBranchStore } from "@/stores/branch-store";
import { Slot } from "@/types";
import { formatTimeForInput } from "@/utils/slot-utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SlotField from "./slot-field";
import { Button } from "./ui/button";

interface AppointmentSlotFields {
  monthDayId: string | undefined;
}

export default function AppointmentSlotFields({
  monthDayId,
}: AppointmentSlotFields) {
  const { selectedBranch } = useBranchStore();
  const { mutate: deleteAppointmentSlot } = useDeleteSlot();
  const { data: slots } = useGetAppointmentSlots(
    monthDayId ?? "",
    selectedBranch?.id || "",
  );

  const [localSlots, setLocalSlots] = useState<Slot[]>();

  useEffect(() => {
    if (!slots) return;

    queueMicrotask(() => {
      setLocalSlots(
        [...slots].sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        ),
      );
    });
  }, [slots]);

  const updateSlot = (slotId: string, updates: Partial<Slot>) => {
    setLocalSlots((prev) =>
      prev?.map((slot) => (slot.id === slotId ? { ...slot, updates } : slot)),
    );
  };

  const deleteSlot = (slotId: string) => {
    deleteAppointmentSlot(slotId, {
      onSuccess: () => {
        toast("Successfully deleted slot");
      },
      onError: (error) => {
        toast.error("Failed to delete slot");
      },
    });
    // setLocalSlots((prev) => prev?.filter((slot) => slot.id !== slotId));
  };

  const checkTimeCollisions = (updatedSlot: Slot): string[] => {
    const collisions: string[] = [];
    const updatedStart = new Date(updatedSlot.startTime);
    const updatedEnd = new Date(updatedSlot.endTime);

    localSlots?.forEach((slot) => {
      if (slot.id === updatedSlot.id) return;

      const slotStart = new Date(slot.startTime);
      const slotEnd = new Date(slot.endTime);

      // Check for time collisions
      if (
        (updatedStart < slotEnd && updatedEnd > slotStart) ||
        (slotStart < updatedEnd && slotEnd > updatedStart)
        // updatedStart < slotEnd
      ) {
        collisions.push(
          `Collision with slot ${formatTimeForInput(slot.startTime)} - ${formatTimeForInput(slot.endTime)}`,
        );
      }
    });

    return collisions;
  };

  const saveChanges = async () => {
    // Validate all slots before saving
    const errors: string[] = [];

    localSlots?.forEach((slot, index) => {
      const collisions = checkTimeCollisions(slot);
      if (collisions.length > 0) {
        errors.push(`Slot ${index + 1}: ${collisions.join(", ")}`);
      }

      // Validate slot duration
      const start = new Date(slot.startTime);
      const end = new Date(slot.endTime);
      if (start >= end) {
        errors.push(`Slot ${index + 1}: End time must be after start time`);
      }
    });

    if (errors.length > 0) {
      toast.error("Time slot errors", {
        description: errors.join("\n"),
      });
      return;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Appointment Slots</h3>
        <Button onClick={saveChanges} size="sm">
          Save Changes
        </Button>
      </div>

      {localSlots?.map((slot, index) => (
        <SlotField
          key={slot.id}
          slot={slot}
          index={index}
          onUpdate={(updates) => updateSlot(slot.id, updates)}
          onDelete={() => deleteSlot(slot.id)}
          allSlots={localSlots || []}
        />
      ))}
    </div>
  );
}
