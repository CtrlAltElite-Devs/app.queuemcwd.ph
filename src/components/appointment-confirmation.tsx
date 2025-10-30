import { Appointment, Slot } from "@/types";
import { X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

interface AppointmentConfirmationProps {
  appointment: Appointment;
  slot: Slot;
  onClose: () => void;
}

export default function AppointmentConfirmation({
  appointment,
  slot,
  onClose,
}: AppointmentConfirmationProps) {
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getCategoryDisplay = (categoryCode: string) => {
    const categories: { [key: string]: string } = {
      Regular: "Regular",
      Senior: "Senior Citizen",
      Pregnant: "Pregnant",
      PWD: "PWD",
    };
    return categories[categoryCode] || categoryCode;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeSpan = (startTime: Date, endTime: Date) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const formatTime = (date: Date) => {
      return date
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .toUpperCase();
    };

    return `${formatTime(start)} TO ${formatTime(end)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative mx-4 max-w-sm rounded-lg border border-gray-200 bg-white shadow-lg">
        {/* Close Button */}
        <button
          onClick={() => onClose()}
          className="absolute -top-2 -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-white shadow-lg transition-colors hover:bg-gray-700"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="rounded-t-lg bg-blue-600 p-4 text-white">
          <h1 className="text-center text-xl font-bold">
            Appointment Confirmed
          </h1>
          <p className="mt-1 text-center text-sm text-blue-100">
            Present this code at your meeting
          </p>
        </div>

        <div className="space-y-4 p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="rounded-lg border border-gray-300 bg-white p-2">
                <QRCodeSVG
                  value={appointment.appointmentCode}
                  size={120}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <p className="text-xs text-gray-600">Appointment Code</p>
                <p className="text-lg font-bold text-gray-800">
                  {appointment.appointmentCode}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div>
                  <p className="text-xs text-gray-600">Date</p>
                  <p className="font-semibold">{formatDate(slot.startTime)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Time</p>
                  <p className="font-semibold">
                    {formatTimeSpan(slot.startTime, slot.endTime)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Category</p>
                  <p className="font-semibold">
                    {getCategoryDisplay(appointment.categoryCode)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Age</p>
                  <p className="font-semibold">{appointment.age}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-3 text-center">
            <p className="text-sm font-medium text-blue-800">Code expires in</p>
            <div
              className={`text-xl font-bold ${
                timeLeft < 300 ? "text-red-600" : "text-blue-600"
              }`}
            >
              {formatTime(timeLeft)}
            </div>
            <p className="mt-1 text-xs text-blue-600">
              Valid for 30 minutes after booking
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <span className="text-sm text-gray-600">Status</span>
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
              {appointment.queueStatus}
            </span>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <h3 className="mb-2 text-sm font-semibold text-yellow-800">
              Important Notes
            </h3>
            <ul className="space-y-1 text-xs text-yellow-700">
              <li>• Keep this code secure</li>
              <li>• Present code upon arrival</li>
              <li>• Expires 30 minutes after booking time</li>
              <li>• Arrive 10 minutes early</li>
            </ul>
          </div>
        </div>

        <div className="rounded-b-lg border-t border-gray-200 bg-gray-100 px-4 py-3">
          <p className="text-center text-xs text-gray-600">
            Contact support if you have questions
          </p>
        </div>
      </div>
    </div>
  );
}
