import Image from "next/image";
import Link from "next/link";
import { ElementType, ReactNode } from "react";

interface NavBarProps {
  title: string;
  children?: ReactNode; // for buttons / toggles
  as?: ElementType;
}

export default function NavBar({
  title,
  children,
  as: Component = "nav",
}: NavBarProps) {
  return (
    <Component className="bg-primary flex w-full items-center justify-between gap-2 px-4 py-4 shadow-sm">
      <Link
        href="/select-service-hub"
        className="flex min-w-0 items-center gap-2"
      >
        <Image
          src="/images/mcwd_logo.png"
          alt="official_logo"
          width={35}
          height={35}
        />
        <h1
          className="truncate text-base font-semibold text-white sm:text-base md:text-lg lg:text-xl"
          style={{ lineHeight: "1.2" }}
        >
          {title}
        </h1>
      </Link>

      <div className="flex items-center gap-2">{children}</div>
    </Component>
  );
}
