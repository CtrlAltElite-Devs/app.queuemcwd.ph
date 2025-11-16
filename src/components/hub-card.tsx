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
      className="group border-secondary bg-background dark:hover:border-primary hover:shadow-primary w-full max-w-sm cursor-pointer overflow-hidden rounded-xl border p-0 text-center transition-all hover:scale-103 hover:shadow-2xl/30"
    >
      {/* Card Image */}
      <div className="relative h-32 w-full overflow-hidden rounded-t-lg opacity-95 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100">
        <Image
          src={imageSrc}
          alt={`${props.name} Logo`}
          fill
          className="object-cover object-top"
        />
      </div>

      <CardHeader className="flex flex-col items-center p-0 sm:mb-4">
        <MapPin className="text-primary/60 group-hover:text-primary size-6 transition-colors sm:size-8" />
        <CardTitle className="sm:text-md text-lg font-semibold">
          {props.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center space-y-4 p-4 pt-0 text-gray-600">
        <p className="group-hover:text-primary text-sm transition-all duration-500 sm:text-base">
          {props.address}
        </p>
        <p className="text-xs font-bold">{props.branchCode}</p>
      </CardContent>
    </Card>
  );
}
