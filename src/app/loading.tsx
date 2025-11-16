"use client";

import { Spinner } from "@/components/ui/spinner"; // your Shadcn spinner

export default function LoadingPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Spinner className="text-primary h-12 w-12" />
    </div>
  );
}
