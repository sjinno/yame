import { Controller, ControllerProps } from './controller';

export function TimerFooter({
  isTimerReady,
  isResettable,
  repeat,
  timerStatus,
  onClear,
  onRepeat,
  onUpdateTimerStatus,
}: ControllerProps) {
  return (
    <div className="h-full flex justify-center items-center">
      <Controller
        isTimerReady={isTimerReady}
        isResettable={isResettable}
        repeat={repeat}
        timerStatus={timerStatus}
        onClear={onClear}
        onRepeat={onRepeat}
        onUpdateTimerStatus={onUpdateTimerStatus}
      />
    </div>
  );
}
