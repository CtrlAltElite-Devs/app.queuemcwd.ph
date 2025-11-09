import Image from "next/image";
import { ElementType } from "react";

interface NavBarProps {
  title: string;
  as?: ElementType;
  href?: string;
}

export default function NavBar({
  title,
  as: Component = "nav",
  href = "/",
}: NavBarProps) {
  return (
    <Component className="bg-primary flex w-full items-center gap-2 px-4 py-4 shadow-sm">
      <Image
        src="/images/mcwd_logo.png"
        alt="official_logo"
        width={25}
        height={25}
      />
      <h1
        className="text-base font-semibold text-white sm:text-base md:text-lg lg:text-xl"
        style={{ lineHeight: "1.2" }}
      >
        {title}
      </h1>
    </Component>
  );
}
