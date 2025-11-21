"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lightbulb, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { CalendarLegend } from "./calendar-legend";

export function FABDialogCalendarLegend() {
  const pathname = usePathname();

  if (pathname !== "/dashboard") return null;

  return (
    <Dialog>
      {/* Floating Action Button in top-right */}
      <DialogTrigger asChild>
        <Button
          className="bg-primary hover:bg-primary/90 fixed bottom-4 left-6 z-50 rounded-full p-3 text-white shadow-lg lg:hidden"
          aria-label="Open Calendar Legend"
        >
          <Lightbulb />
        </Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Calendar Legend</DialogTitle>
          <DialogClose asChild>
            <button className="absolute top-3 right-3 rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700">
              <X className="h-4 w-4" />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="mt-2">
          <CalendarLegend />
        </div>
      </DialogContent>
    </Dialog>
  );
}
