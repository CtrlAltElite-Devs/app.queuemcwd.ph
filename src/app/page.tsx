"use client";

import AppointmentSlots from "@/components/appointment-slots";
import Calendar05 from "@/components/feature/calendar";

export default function Home() {
  return (
    <div className="bg-zinc-50 font-sans dark:bg-black">
      <div className="flex min-h-screen flex-col">
        <header className="w-full bg-black px-6 py-4 shadow-sm dark:bg-zinc-900">
          <h1 className="text-center text-lg font-semibold text-white sm:text-left sm:text-xl md:text-2xl">
            Metropolitan Cebu Water District
          </h1>
        </header>
        <main className="mx-auto mt-15 flex max-w-[1000px] flex-1 flex-col items-center justify-center gap-10 lg:flex-row lg:items-start lg:justify-around">
          <div className="">
            <Calendar05 />
          </div>
          <AppointmentSlots />
        </main>
        <footer className="w-full border-t border-zinc-300 bg-white/60 py-4 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
          © {new Date().getFullYear()} Metropolitan Cebu Water District. All
          rights reserved.
        </footer>
      </div>
    </div>
  );
}
