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
    <Component className="bg-primary w-full px-6 py-4 shadow-sm">
      <h1 className="text-center text-lg font-semibold text-white sm:text-left sm:text-xl md:text-2xl">
        {/* Metropolitan Cebu Water District */}
        {title}
      </h1>
    </Component>
  );
}
