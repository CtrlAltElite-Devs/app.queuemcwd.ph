import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export type UpdateAppointmentStatusDto = {
  appointmentId: string;
  queueStatus: string;
};

const updateAppointmentStatus = async (dto: UpdateAppointmentStatusDto) => {
  const response = await api.patch(
    `/api/v1/appointments/${dto.appointmentId}`,
    { queueStatus: dto.queueStatus },
  );
  return response.data;
};

export const useUpdateAppointmentStatus = () =>
  useMutation({
    mutationFn: updateAppointmentStatus,
  });
