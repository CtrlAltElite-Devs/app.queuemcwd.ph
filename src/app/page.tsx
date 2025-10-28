"use client";

import AppointmentSlots from "@/components/appointment-slots";
import Calendar05 from "@/components/calendar";
import MainLayout from "@/components/layouts/main-layout";

export default function Home() {
  return (
    <MainLayout>
      <Calendar05 />
      <AppointmentSlots />
    </MainLayout>
  );
}
