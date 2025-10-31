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
    <Component className="bg-primary flex w-full items-center px-4 py-4 shadow-sm">
      <h1
        className="text-base font-semibold text-white sm:text-lg md:text-xl lg:text-2xl"
        style={{ lineHeight: "1.2" }}
      >
        {title}
      </h1>
    </Component>
  );
}
