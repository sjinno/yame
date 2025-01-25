import { Hms } from '../types';

interface Props {
  hms: Hms;
  originalHms: Hms;
}

export function ProgressBar({ hms, originalHms }: Props) {
  return (
    <progress
      id="file"
      value={calcProgress(hms, originalHms)}
      max="100"
      style={{ width: '365px' }}
    />
  );
}

function calcProgress(hms: Hms, originalHms: Hms): number {
  const h1 = hms.hours ?? 0;
  const m1 = hms.minutes ?? 0;
  const s1 = hms.seconds ?? 0;

  const h2 = originalHms.hours ?? 0;
  const m2 = originalHms.minutes ?? 0;
  const s2 = originalHms.seconds ?? 0;

  const total = h2 * 60 * 60 + m2 * 60 + s2;

  return (((h2 - h1) * 60 * 60 + (m2 - m1) * 60 + (s2 - s1)) / total) * 100;
}
