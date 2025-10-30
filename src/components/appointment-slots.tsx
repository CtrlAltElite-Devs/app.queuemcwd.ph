"use client";

import { Slot } from "@/types";
import { loadSlots } from "@/utils/slot-utils";
import { useEffect, useState } from "react";
import AppointmentForm from "./appointment-form";
import AppointmentSlot from "./slot";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function AppointmentSlots() {
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    async function fetchSlots() {
      const data = await loadSlots("2025-01-15"); // pass your dayId
      setSlots(data);
    }

    fetchSlots();
  }, []);
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {slots.map((slot) => (
        <Dialog key={slot.id}>
          <DialogTrigger>
            <AppointmentSlot
              slot={slot}
              onSelect={() => {
                console.log("hello", slot.id);
              }}
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter your details</DialogTitle>
              {/* <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription> */}
            </DialogHeader>
            <AppointmentForm />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
