import { useSlotManager } from "@/hooks/use-slot-manager";
import { useGetAppointmentSlots } from "@/services/get-appointment-slots";
import { useBranchStore } from "@/stores/branch-store";
import { useEffect } from "react";
import SlotField from "./slot-field";
import { Button } from "./ui/button";

interface AppointmentSlotFields {
  monthDayId: string;
}

export default function AppointmentSlotFields({
  monthDayId,
}: AppointmentSlotFields) {
  const { selectedBranch } = useBranchStore();
  const branchId = selectedBranch?.id || "";

  const { data: slots } = useGetAppointmentSlots(monthDayId || "", branchId);
  const {
    slots: localSlots,
    status,
    errors,
    initializeSlots,
    updateSlot,
    deleteSlot,
    saveChanges,
    isValid,
  } = useSlotManager(monthDayId, branchId);

  useEffect(() => {
    if (slots) {
      initializeSlots(slots);
    }
  }, [slots, initializeSlots]);

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
