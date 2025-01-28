import { Hms } from '../../types';
import { formatDuration } from '../../utils/timer';
import { ProgressBar } from '../progress-bar';

export interface TimerDisplayProps {
  hms: Hms;
  originalHms: Hms;
}

export function TimerDisplay({ hms, originalHms }: TimerDisplayProps) {
  return (
    <div className="h-full flex flex-col justify-center items-center gap-0.5 py-0.5">
      <div className="text-xs">time remaining:</div>
      <div className="text-4xl font-medium">
        {formatDuration(hms.hours ?? 0)}:{formatDuration(hms.minutes ?? 0)}:
        {formatDuration(hms.seconds ?? 0)}
      </div>
      <ProgressBar hms={hms} originalHms={originalHms} />
    </div>
  );
}
