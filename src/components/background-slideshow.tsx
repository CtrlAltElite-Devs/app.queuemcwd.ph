"use client";

import { useTheme } from "next-themes";
import { PropsWithChildren, useEffect, useState } from "react";

type BackgroundSlideShowProps = PropsWithChildren<{
  blur?: number;
  overlayOpacity?: number;
  interval?: number;
}>;

const backgrounds = [
  "/images/main_office.jpg",
  "/images/sm_consolacion_hub.jpg",
];

export default function BackgroundSlideShow({
  children,
  blur = 8,
  overlayOpacity = 0.8,
  interval = 5000,
}: BackgroundSlideShowProps) {
  const { resolvedTheme } = useTheme();
  const [bgIndex, setBgIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Rotate background every interval
  useEffect(() => {
    const id = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  if (!mounted) return null;

  const overlayColor =
    typeof window !== "undefined"
      ? resolvedTheme === "dark"
        ? `rgba(0,0,0,${overlayOpacity})`
        : `rgba(255,255,255,${overlayOpacity * 0.6})`
      : "transparent";

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {backgrounds.map((src, index) => (
        <div
          key={src}
          className={`duration-2000ms absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity ease-in-out ${
            bgIndex === index ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${src})`,
            filter: `blur(${blur}px)`,
            transform: "scale(1.05)",
          }}
        />
      ))}

      <div
        className="absolute inset-0 z-10 transition-colors duration-500"
        style={{ backgroundColor: overlayColor }}
      />

      <div className="relative z-20">{children}</div>
    </div>
  );
}
