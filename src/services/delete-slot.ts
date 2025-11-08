import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

const deleteSlot = async (slotId: string) => {
  const response = await api.delete(`/api/v1/slots/${slotId}`);
  return response.data;
};

export const useDeleteSlot = () =>
  useMutation({
    mutationFn: deleteSlot,
  });
