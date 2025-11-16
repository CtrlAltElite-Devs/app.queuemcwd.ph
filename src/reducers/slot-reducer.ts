// For fucking admin use
import { Slot } from "@/types";

export interface SlotState {
  slots: Slot[];
  pendingAddedSlots: Slot[];
  status: "idle" | "loading" | "saving" | "deleting" | "adding";
  errors: string[];
}

export type SlotAction =
  | { type: "SET_SLOTS"; payload: Slot[] }
  | { type: "UPDATE_SLOT"; payload: { id: string; updates: Partial<Slot> } }
  | { type: "DELETE_SLOT"; payload: string }
  | { type: "ADDING_SLOT"; payload: Slot }
  | { type: "DELETE_PENDING_SLOT"; payload: string }
  | { type: "RESET_PENDING_SLOT" }
  | { type: "SET_STATUS"; payload: SlotState["status"] }
  | { type: "ADD_ERROR"; payload: string }
  | { type: "CLEAR_ERRORS" };

export function slotReducer(state: SlotState, action: SlotAction): SlotState {
  switch (action.type) {
    case "SET_SLOTS":
      return {
        ...state,
        slots: action.payload,
        errors: [],
      };

    case "UPDATE_SLOT":
      const { id, updates } = action.payload;

      const slotPending = state.pendingAddedSlots.find((s) => s.id === id);

      let updatedPendingSlots = [] as Slot[];

      if (slotPending) {
        updatedPendingSlots = state.pendingAddedSlots.map((slot) =>
          slot.id === action.payload.id ? { ...slot, ...updates } : slot,
        );
      }

      return {
        ...state,
        pendingAddedSlots: slotPending
          ? updatedPendingSlots
          : state.pendingAddedSlots,
        slots: state.slots.map((slot) =>
          slot.id === action.payload.id
            ? { ...slot, ...action.payload.updates }
            : slot,
        ),
      };

    case "DELETE_SLOT":
      return {
        ...state,
        slots: state.slots.filter((slot) => slot.id !== action.payload),
      };

    case "ADDING_SLOT":
      return {
        ...state,
        pendingAddedSlots: [...state.pendingAddedSlots, action.payload],
      };

    case "DELETE_PENDING_SLOT":
      return {
        ...state,
        pendingAddedSlots: state.pendingAddedSlots.filter(
          (s) => s.id !== action.payload,
        ),
      };

    case "RESET_PENDING_SLOT":
      return {
        ...state,
        pendingAddedSlots: [],
      };

    case "SET_STATUS":
      return {
        ...state,
        status: action.payload,
      };

    case "ADD_ERROR":
      return {
        ...state,
        errors: [...state.errors, action.payload],
      };

    case "CLEAR_ERRORS":
      return {
        ...state,
        errors: [],
      };

    default:
      return state;
  }
}

export const initialSlotState: SlotState = {
  slots: [],
  pendingAddedSlots: [],
  status: "idle",
  errors: [],
};
