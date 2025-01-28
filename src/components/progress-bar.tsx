import { Hms } from '../types';

interface Props {
  hms: Hms;
  originalHms: Hms;
}

export function ProgressBar({ hms, originalHms }: Props) {
  return (
    <div className="w-[55%] bg-white rounded-full h-1 dark:bg-gray-700">
      <div
        className="bg-blue-600 h-1 rounded-full"
        style={{ width: `${calcProgress(hms, originalHms)}%` }}
      ></div>
    </div>
  );
}

function calcProgress(currentHms: Hms, originalHms: Hms): number {
  // Extract and default to 0 if null/undefined
  const currentHours = currentHms.hours ?? 0;
  const currentMinutes = currentHms.minutes ?? 0;
  const currentSeconds = currentHms.seconds ?? 0;

  const originalHours = originalHms.hours ?? 0;
  const originalMinutes = originalHms.minutes ?? 0;
  const originalSeconds = originalHms.seconds ?? 0;

  // Calculate total time in seconds
  const totalOriginalTimeInSecs =
    originalHours * 3600 + originalMinutes * 60 + originalSeconds;

  if (totalOriginalTimeInSecs === 0) {
    return 0; // Avoid division by zero
  }

  // Calculate elapsed time in seconds
  const elapsedTimeInSecs =
    (originalHours - currentHours) * 3600 +
    (originalMinutes - currentMinutes) * 60 +
    (originalSeconds - currentSeconds);

  // Calculate progress as a percentage
  const progressPercentage =
    (elapsedTimeInSecs / totalOriginalTimeInSecs) * 100;

  return progressPercentage; // You can round this if necessary
}
