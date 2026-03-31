"use client";

import { appointmentTypeToService, Service } from "@/constants";
import { cn } from "@/lib/utils";
import { AppointmentResponse, QueueStatus } from "@/types";
import { Check, Copy, Phone, Receipt, User } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  [QueueStatus.ACTIVE]: {
    label: "Active",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  [QueueStatus.ARRIVED]: {
    label: "Arrived",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  [QueueStatus.PENDING]: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  [QueueStatus.DONE]: {
    label: "Done",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
  [QueueStatus.CANCELLED]: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
  [QueueStatus.EXPIRED]: {
    label: "Expired",
    className:
      "bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400",
  },
  [QueueStatus.NO_SHOW]: {
    label: "No Show",
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  },
};

const serviceStyles: Record<string, string> = {
  [Service.BILLING_CONCERNS]:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  [Service.WATER_SUPPLIER_ISSUES]:
    "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
  [Service.LEAK_REPORTS]:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  [Service.SERVICE_CONNECTION_CONCERNS]:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
};

function StatusBadge({ status }: { status: QueueStatus }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1500);
  }, [value]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground hover:bg-muted -m-1 rounded p-1 transition-colors"
        >
          {copied ? (
            <Check className="size-3 text-emerald-500" />
          ) : (
            <Copy className="size-3" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : `Copy ${label}`}</TooltipContent>
    </Tooltip>
  );
}

function ServiceBadge({ serviceName }: { serviceName: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        serviceStyles[serviceName] ??
          "bg-muted text-muted-foreground border-border",
      )}
    >
      {serviceName}
    </span>
  );
}

interface QueueAppointmentCardProps {
  appointment: AppointmentResponse;
  variant?: "row" | "card";
}

export default function QueueAppointmentCard({
  appointment,
  variant = "row",
}: QueueAppointmentCardProps) {
  const serviceName = appointmentTypeToService(appointment.appointmentType);
  const isTerminal = [
    QueueStatus.DONE,
    QueueStatus.CANCELLED,
    QueueStatus.EXPIRED,
    QueueStatus.NO_SHOW,
  ].includes(appointment.queueStatus);

  if (variant === "card") {
    return (
      <div
        className={cn(
          "bg-card flex flex-col rounded-lg border transition-colors",
          isTerminal ? "opacity-60" : "hover:border-primary/30",
        )}
      >
        <div className="flex items-center justify-between border-b px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
              {appointment.appointmentCode}
            </span>
            <CopyButton value={appointment.appointmentCode} label="ref code" />
          </div>
          <StatusBadge status={appointment.queueStatus} />
        </div>
        <div className="flex flex-col gap-2 px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <User className="text-muted-foreground size-3.5 shrink-0" />
            <span className="truncate text-sm font-medium">
              {appointment.contactPerson}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Receipt className="text-muted-foreground size-3.5 shrink-0" />
              <span className="text-muted-foreground text-sm">
                {appointment.accountCode}
              </span>
            </div>
            <CopyButton value={appointment.accountCode} label="account" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Phone className="text-muted-foreground size-3.5 shrink-0" />
              <span className="text-muted-foreground text-sm">
                {appointment.contact}
              </span>
            </div>
            <CopyButton value={appointment.contact} label="phone" />
          </div>
        </div>
        <div className="mt-auto border-t px-3 py-2">
          <ServiceBadge serviceName={serviceName} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between",
        isTerminal
          ? "bg-muted/30 opacity-75"
          : "bg-card hover:border-primary/20",
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-2">
          <span className="bg-muted rounded px-2 py-1 font-mono text-xs">
            {appointment.appointmentCode}
          </span>
          <CopyButton value={appointment.appointmentCode} label="ref code" />
          <StatusBadge status={appointment.queueStatus} />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="flex items-center gap-1.5">
            <User className="text-muted-foreground size-3.5" />
            {appointment.contactPerson}
          </span>
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Receipt className="size-3.5" />
            {appointment.accountCode}
            <CopyButton value={appointment.accountCode} label="account" />
          </span>
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Phone className="size-3.5" />
            {appointment.contact}
            <CopyButton value={appointment.contact} label="phone" />
          </span>
        </div>
        <ServiceBadge serviceName={serviceName} />
      </div>
    </div>
  );
}
