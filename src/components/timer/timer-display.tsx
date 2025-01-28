import { Hms } from '../../types';
import { formatDuration } from '../../utils/timer';
import { ProgressBar } from '../progress-bar';

interface Props {
  hms: Hms;
  originalHms: Hms;
}

export function TimerDisplay({ hms, originalHms }: Props) {
  return (
    <>
      <div className="my-1.5">
        <div className="text-xs ml-0.5">time remaining:</div>
        <div className="text-5xl mt-0.5">
          {formatDuration(hms.hours ?? 0)}:{formatDuration(hms.minutes ?? 0)}:
          {formatDuration(hms.seconds ?? 0)}
        </div>
      </div>
      <ProgressBar hms={hms} originalHms={originalHms} />
    </>
  );
}
