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

export function formatTimeToHHmm(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
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
