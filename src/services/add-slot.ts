import { api } from "@/lib/axios";
import { Slot } from "@/types";
import { useMutation } from "@tanstack/react-query";

export type CreateSlotDto = {
  monthDayId: string;
  limit: number;
  startTime: string;
  endTime: string;
};

const createSlot = async (dto: CreateSlotDto): Promise<Slot> => {
  const response = await api.post("/api/v1/slots", dto);
  return response.data;
};

export const useCreateSlot = () =>
  useMutation({
    mutationFn: createSlot,
  });
