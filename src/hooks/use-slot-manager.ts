import { initialSlotState, slotReducer } from "@/reducers/slot-reducer";
import { useCreateSlot } from "@/services/add-slot";
import { useDeleteSlot } from "@/services/delete-slot";
import { EditSlotDto, useEditSlot } from "@/services/edit-slot";
import { Slot } from "@/types";
import { formatTimeToHHmm } from "@/utils";
import { SlotHelpers } from "@/utils/slot-helpers";
import { formatTimeForInput } from "@/utils/slot-utils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useReducer } from "react";
import { toast } from "sonner";

export function useSlotManager(monthDayId: string, branchId: string) {
  const [state, dispatch] = useReducer(slotReducer, initialSlotState);
  const { mutate: deleteAppointmentSlot } = useDeleteSlot();
  const { mutate: createSlot } = useCreateSlot();
  const { mutate: editSlot } = useEditSlot();
  const queryClient = useQueryClient();

  const initializeSlots = useCallback((slots: Slot[]) => {
    const sortedSlots = [...slots].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
    dispatch({ type: "SET_SLOTS", payload: sortedSlots });
  }, []);

  const updateSlot = useCallback((slotId: string, updates: Partial<Slot>) => {
    dispatch({ type: "UPDATE_SLOT", payload: { id: slotId, updates } });
  }, []);

  const deleteSlot = useCallback(
    (slotId: string) => {
      const pendingSlot = state.pendingAddedSlots.find((s) => s.id === slotId);

      if (pendingSlot) {
        dispatch({ type: "DELETE_PENDING_SLOT", payload: pendingSlot.id });
        return;
      }

      dispatch({ type: "DELETE_SLOT", payload: slotId });

      deleteAppointmentSlot(slotId, {
        onSuccess: () => {
          toast.success("Successfully deleted slot");
          queryClient.invalidateQueries({
            queryKey: ["appointment-slots", monthDayId, branchId],
          });
        },
        onError: (error) => {
          toast.error("Failed to delete slot");
          queryClient.invalidateQueries({
            queryKey: ["appointment-slots", monthDayId, branchId],
          });
        },
      });
    },
    [
      state.pendingAddedSlots,
      deleteAppointmentSlot,
      queryClient,
      monthDayId,
      branchId,
    ],
  );

  const addPendingSlot = useCallback(() => {
    const lastSlot = state.pendingAddedSlots.length
      ? state.pendingAddedSlots[state.pendingAddedSlots.length - 1]
      : state.slots[state.slots.length - 1];

    const lastSlotEnd = lastSlot ? new Date(lastSlot.endTime) : null;
    const { startTime, endTime } = SlotHelpers.createSlotAfter(lastSlotEnd);

    const newSlot: Partial<Slot> = {
      ...(lastSlot ?? {}),
      id: crypto.randomUUID(),
      startTime,
      endTime,
      ...(lastSlot ? { id: crypto.randomUUID(), booked: 0 } : {}),
    };

    console.log("Created new 1-hour slot:", {
      start: startTime.toLocaleTimeString(),
      end: endTime.toLocaleTimeString(),
      date: startTime.toLocaleDateString(),
    });

    dispatch({ type: "ADDING_SLOT", payload: newSlot as Slot });
  }, [state.pendingAddedSlots, state.slots, dispatch]);

  const resetPendingSlot = useCallback(() => {
    dispatch({ type: "RESET_PENDING_SLOT" });
  }, []);

  const addSlotToApi = useCallback(
    (slot: Slot) => {
      const newSlot = state.pendingAddedSlots.find((s) => s.id === slot.id);

      if (!newSlot) return;

      console.log(`new slot: ${JSON.stringify(newSlot, null, 2)}`);

      const newSlotDto = {
        monthDayId,
        limit: newSlot.maxCapacity,
        startTime: formatTimeToHHmm(newSlot.startTime),
        endTime: formatTimeToHHmm(newSlot.endTime),
      };

      console.log(`new slot dto: ${JSON.stringify(newSlotDto, null, 2)}`);

      createSlot(newSlotDto, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["appointment-slots", monthDayId, branchId],
          });
          deleteSlot(newSlot.id);
          toast.success("Slot successfully added");
        },
        onError: () => {
          toast.error("Failed to add slot");
        },
      });
    },
    [
      branchId,
      createSlot,
      monthDayId,
      queryClient,
      state.pendingAddedSlots,
      deleteSlot,
    ],
  );

  const saveSlotChangesToApi = useCallback(
    (slot: Slot) => {
      const editSlotDto = {
        slotId: slot.id,
        limit: slot.maxCapacity,
        startTime: formatTimeToHHmm(slot.startTime),
        endTime: formatTimeToHHmm(slot.endTime),
      };
      editSlot(editSlotDto as EditSlotDto, {
        onSuccess: () => {
          toast.success("Slot successfully updated");
        },
        onError: () => {
          toast.error("Failed to update slot");
        },
      });
    },
    [editSlot],
  );

  const onDiscard = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["appointment-slots", monthDayId, branchId],
    });
  }, [branchId, monthDayId, queryClient]);

  const validateTimeCollisions = useCallback(
    (updatedSlot: Slot): string[] => {
      const collisions: string[] = [];
      const updatedStart = new Date(updatedSlot.startTime);
      const updatedEnd = new Date(updatedSlot.endTime);

      state.slots.forEach((slot) => {
        if (slot.id === updatedSlot.id) return;

        const slotStart = new Date(slot.startTime);
        const slotEnd = new Date(slot.endTime);

        if (updatedStart < slotEnd && updatedEnd > slotStart) {
          collisions.push(
            `Collision with slot ${formatTimeForInput(slot.startTime)} - ${formatTimeForInput(slot.endTime)}`,
          );
        }
      });

      return collisions;
    },
    [state.slots],
  );

  // Validate all slots
  const validateAllSlots = useCallback((): string[] => {
    const errors: string[] = [];

    state.slots.forEach((slot, index) => {
      // Check for collisions
      const collisions = validateTimeCollisions(slot);
      if (collisions.length > 0) {
        errors.push(`Slot ${index + 1}: ${collisions.join(", ")}`);
      }

      // Validate slot duration
      const start = new Date(slot.startTime);
      const end = new Date(slot.endTime);
      if (start >= end) {
        errors.push(`Slot ${index + 1}: End time must be after start time`);
      }

      // Validate capacity
      // if (slot.capacity < 1) {
      //   errors.push(`Slot ${index + 1}: Capacity must be at least 1`);
      // }
    });

    return errors;
  }, [state.slots, validateTimeCollisions]);

  // const addingSlot = () => {
  //   dispatch({ type: "SET_STATUS", payload: "adding" });
  // };

  const saveChanges = useCallback(async () => {
    dispatch({ type: "SET_STATUS", payload: "saving" });
    dispatch({ type: "CLEAR_ERRORS" });

    const validationErrors = validateAllSlots();

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) =>
        dispatch({ type: "ADD_ERROR", payload: error }),
      );

      toast.error("Time slot errors", {
        description: validationErrors.join("\n"),
      });
      dispatch({ type: "SET_STATUS", payload: "idle" });
      return;
    }

    try {
      // API calls to save all changes
      toast.success("Changes saved successfully");
      dispatch({ type: "SET_STATUS", payload: "idle" });
    } catch (error) {
      toast.error("Failed to save changes");
      dispatch({ type: "SET_STATUS", payload: "idle" });
    }
  }, [state.slots, validateAllSlots]);

  return {
    // State
    slots: state.slots,
    status: state.status,
    errors: state.errors,
    pendingAddedSlots: state.pendingAddedSlots,

    // Actions
    initializeSlots,
    updateSlot,
    deleteSlot,
    saveChanges,
    validateTimeCollisions,
    addPendingSlot,
    addSlotToApi,
    saveSlotChangesToApi,
    onDiscard,
    resetPendingSlot,

    // Derived state
    hasChanges: state.slots.length > 0,
    isValid: state.errors.length === 0,
  };
}
