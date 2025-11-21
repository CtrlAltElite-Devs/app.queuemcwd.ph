"use client";

import Image from "next/image";
import { useMemo } from "react";

interface LoadingProps {
  size?: number; // size of the logo in px
  className?: string;
}

const waterTips = [
  "Conserve water, conserve life!",
  "Turn off taps when not in use.",
  "Check for leaks regularly.",
  "Use water wisely every day.",
  "Save water, save our future.",
  "Rainwater harvesting helps your community.",
  "Report any pipe leaks promptly.",
];

export default function LoadingUi({ size = 60, className = "" }: LoadingProps) {
  // Pick a random tip on each render
  const tip = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const index = Math.floor(Math.random() * waterTips.length);
    return waterTips[index];
  }, []);

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center justify-center ${className} gap-4`}
    >
      {/* Logo with bounce animation */}
      <div className="animate-bounce">
        <Image
          src="/images/mcwd_logo.png"
          alt="MCWD Logo"
          width={size}
          height={size}
          className="rounded-full"
        />
      </div>

      {/* Water tip text with pulse animation */}
      <p className="max-w-xs animate-pulse text-center text-lg text-gray-700 sm:max-w-sm dark:text-gray-200">
        {tip}
      </p>
    </div>
  );
}
