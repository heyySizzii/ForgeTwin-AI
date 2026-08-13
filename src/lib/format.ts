export function round(
  value: number,
  digits = 2
): number {
  const multiplier = 10 ** digits;

  return Math.round(value * multiplier) / multiplier;
}

export function formatBytes(
  bytes: number
): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "—";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB"
  ];

  let value = bytes;
  let index = 0;

  while (
    value >= 1024 &&
    index < units.length - 1
  ) {
    value /= 1024;
    index++;
  }

  return `${value.toFixed(1)} ${units[index]}`;
}

export function formatTime(
  timestamp: number
): string {
  return new Date(timestamp).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }
  );
}
