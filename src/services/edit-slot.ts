import { api } from "@/lib/axios";
import { Slot } from "@/types";
import { useMutation } from "@tanstack/react-query";

export type EditSlotDto = {
  slotId: string;
  limit: number;
  startTime: string;
  endTime: string;
};

const editSlot = async (dto: EditSlotDto): Promise<Slot> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { slotId, ...data } = dto;
  const response = await api.patch(`/api/v1/slots/${dto.slotId}`, data);
  return response.data;
};

export const useEditSlot = () =>
  useMutation({
    mutationFn: editSlot,
  });
