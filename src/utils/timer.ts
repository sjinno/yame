export function formatDuration(d: number): string {
  const d_ = d < 0 ? 0 : d;
  return d_ / 10 < 1 ? `0${d_}` : d_.toString();
}
