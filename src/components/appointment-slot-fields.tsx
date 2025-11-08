import { useGetAppointmentSlots } from "@/services/get-appointment-slots";
import { useBranchStore } from "@/stores/branch-store";
import { calculateDuration, formatTimeForInput } from "@/utils/slot-utils";
import { FaTrashCan } from "react-icons/fa6";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AppointmentSlotFields {
  monthDayId: string | undefined;
}

export default function AppointmentSlotFields({
  monthDayId,
}: AppointmentSlotFields) {
  const { selectedBranch } = useBranchStore();
  const { data: slots } = useGetAppointmentSlots(
    monthDayId ?? "",
    selectedBranch?.id || "",
  );

  console.log(slots);

  return (
    <div>
      {slots &&
        slots.map((slot) => {
          return (
            <ul
              key={slot.id}
              className="grid grid-cols-5 items-center gap-6 space-y-4"
            >
              <li className="space-y-1">
                <Label className="text-xs text-gray-500" htmlFor="startTime">
                  Start Time
                </Label>
                <Input
                  type="time"
                  className="text-sm"
                  defaultValue={formatTimeForInput(slot.startTime)}
                  id="startTime"
                />
              </li>
              <li className="space-y-1">
                <Label className="text-xs text-gray-500" htmlFor="endTime">
                  End Time
                </Label>
                <Input
                  type="time"
                  className="text-sm"
                  defaultValue={formatTimeForInput(slot.endTime)}
                  id="endTime"
                />
              </li>
              <li className="space-y-1">
                <Label className="text-xs text-gray-500" htmlFor="duration">
                  Duration
                </Label>
                <Input
                  defaultValue={calculateDuration(slot.startTime, slot.endTime)}
                  className="text-sm"
                  id="duration"
                />
              </li>
              <li className="space-y-1">
                <Label className="text-xs text-gray-500" htmlFor="capacity">
                  Capacity
                </Label>
                <Input
                  type="number"
                  defaultValue={slot.maxCapacity - slot.booked}
                  className="text-sm"
                  id="capacity"
                />
              </li>
              <li className="cursor-pointer">
                <FaTrashCan className="text-red-400" />
              </li>
            </ul>
          );
        })}
    </div>
  );
}
