import { Branch } from "@/types";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const branchImages: Record<string, string> = {
  MAIN: "/images/main_office.jpg",
  SMCL: "/images/sm_consolacion_hub.jpg",
};

type HubCardProps = Branch & {
  onSelect: (branch: Branch) => void;
};

export default function HubCard(props: HubCardProps) {
  const imageSrc = branchImages[props.branchCode];

  return (
    <Card
      onClick={() => props.onSelect(props)}
      className="group border-secondary bg-background dark:hover:border-primary w-full max-w-sm cursor-pointer overflow-hidden rounded-xl border p-0 text-center transition-all hover:scale-[1.03] hover:shadow-2xl/30"
    >
      {/* Card Image */}
      <div className="relative h-32 w-full overflow-hidden rounded-t-lg opacity-95 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100">
        <Image
          src={imageSrc}
          alt={`${props.name} branch photo`}
          fill
          sizes="80vw"
          loading="eager"
          className="object-cover object-top"
        />
      </div>

      <CardHeader className="flex flex-col items-center gap-1 p-0 sm:mb-3">
        <MapPin className="text-primary/70 group-hover:text-primary dark:text-primary/60 dark:group-hover:text-primary size-6 transition-colors sm:size-7" />

        <CardTitle className="text-foreground text-lg font-semibold sm:text-xl dark:text-white">
          {props.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center space-y-3 p-4 pt-0">
        {/* Address */}
        <p className="text-muted-foreground group-hover:text-primary dark:group-hover:text-primary/90 text-sm transition-colors duration-300 sm:text-base dark:text-gray-300">
          {props.address}
        </p>

        {/* Branch Code */}
        <p className="bg-secondary/50 text-secondary-foreground dark:bg-primary/15 dark:text-primary rounded-md px-2 py-0.5 text-xs font-semibold">
          {props.branchCode}
        </p>
      </CardContent>
    </Card>
  );
}
