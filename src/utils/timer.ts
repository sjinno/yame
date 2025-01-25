export function formatDuration(d: number): string {
  return d / 10 < 1 ? `0${d}` : d.toString();
}
