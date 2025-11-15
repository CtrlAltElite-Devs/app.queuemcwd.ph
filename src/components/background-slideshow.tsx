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

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const id = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  if (!mounted) return null;

  const overlayColor =
    resolvedTheme === "dark"
      ? `rgba(0,0,0,${overlayOpacity})`
      : `rgba(255,255,255,${overlayOpacity * 0.6})`;

  return (
    <div className="relative w-full">
      {/* Background Layer */}
      {backgrounds.map((src, index) => (
        <div
          key={src}
          className={`fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            bgIndex === index ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${src})`,
            filter: `blur(${blur}px)`,
            transform: "scale(1.05)",
          }}
        />
      ))}

      {/* Overlay */}
      <div
        className="fixed inset-0 z-10 transition-colors duration-500"
        style={{ backgroundColor: overlayColor }}
      />

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </div>
  );
}
