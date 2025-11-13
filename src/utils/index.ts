export function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function getBaseUrl() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return `https://${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_URL}`;
}

export function formatTimeToHHmm(dateOrString: Date | string): string {
  try {
    // If it's already a time string in "HH:mm" format, return it directly
    if (
      typeof dateOrString === "string" &&
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(dateOrString)
    ) {
      console.log(`Already time string: ${dateOrString} -> ${dateOrString}`);
      return dateOrString;
    }

    // If it's an ISO string or Date object, parse it
    const date =
      typeof dateOrString === "string" ? new Date(dateOrString) : dateOrString;

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateOrString);
      return "00:00";
    }

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    console.log(`Formatting: ${dateOrString} -> ${hours}:${minutes}`);
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting time:", error, dateOrString);
    return "00:00";
  }
}

export function formatTimeForInput(isoString: string): string {
  return formatTimeToHHmm(isoString);
}

export function HHmmToISOString(
  timeString: string,
  baseDate: Date = new Date(),
): string {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

export const isElevenPmOrLater = (date: Date): boolean => {
  const hours = date.getHours();
  return hours >= 23;
};

export const createNextDayTime = (
  baseDate: Date,
  hours: number,
  minutes: number = 0,
): Date => {
  const nextDay = new Date(baseDate);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(hours, minutes, 0, 0);
  return nextDay;
};
