import { Branch } from "@/types";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type HubCardProps = Branch & {
  onSelect: (branch: Branch) => void;
};

export default function HubCard(props: HubCardProps) {
  return (
    <Card
      onClick={() => props.onSelect(props)}
      className="w-full max-w-sm cursor-pointer rounded-xl text-center transition-all hover:shadow-lg hover:-translate-y-1 p-4 sm:p-6 border border-gray-200"
    >
      <CardHeader className="flex flex-col items-center p-0 mb-3 sm:mb-4">
        <MapPin className="text-blue-500 w-7 h-7 sm:w-8 sm:h-8 mb-2" />
        <CardTitle className="text-lg sm:text-xl font-semibold">
          {props.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 text-gray-600 space-y-1 flex flex-col items-center">
        <p className="text-sm sm:text-base">{props.address}</p>
        <p className="text-xs text-gray-500">{props.branchCode}</p>
      </CardContent>
    </Card>
  );
}
