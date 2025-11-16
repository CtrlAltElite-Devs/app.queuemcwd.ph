"use client";

import BackgroundSlideShow from "@/components/background-slideshow";
import NavBar from "@/components/containers/navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MaintenancePage() {
  const title = "Metropolitan Cebu Water District";

  const router = useRouter();

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/status`,
        );
        if (res.ok) router.replace("/"); // site back up → redirect
      } catch {}
    }
    checkStatus();
  }, [router]);

  return (
    <BackgroundSlideShow>
      <div className="flex min-h-screen min-w-full flex-col">
        {/* Navbar */}
        <NavBar title={title} />

        {/* Maintenance message */}
        <div className="text-primary flex flex-1 flex-col items-center justify-center px-4 text-center dark:bg-gray-900 dark:text-gray-100">
          <h1 className="animate-fade-in mb-4 text-4xl font-bold md:text-6xl">
            🚧 Site Under Maintenance
          </h1>
          <p className="animate-fade-in mb-6 text-lg delay-200 md:text-2xl">
            Sorry for the inconvenience. We’re working to improve the website.
          </p>
          <p className="animate-fade-in text-sm text-gray-500 delay-400 md:text-base dark:text-gray-400">
            Please check back later.
          </p>
        </div>
      </div>
    </BackgroundSlideShow>
  );
}
