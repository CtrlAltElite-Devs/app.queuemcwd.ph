"use client";

import AppointmentCalendar from "@/components/appointment-calendar";
import AppointmentSlots from "@/components/appointment-slots";
import MainLayout from "@/components/layouts/main-layout";

export default function Home() {
  return (
    <MainLayout>
      <AppointmentCalendar />
      <AppointmentSlots />
    </MainLayout>
  );
}
