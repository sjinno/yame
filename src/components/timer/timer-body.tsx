import { TimerDisplay, TimerDisplayProps } from './timer-display';
import { TimerEdit, TimerEditProps } from './timer-edit';

export type TimerBodyProps = TimerDisplayProps & TimerEditProps;

export function TimerBody(props: TimerBodyProps) {
  const {
    hms,
    originalHms,
    repeat,
    typing,
    timerStatus,
    setHms,
    setOriginalHms,
    onUpdateTimerStatus,
    onUpdateTyping,
  } = props;

  const renderContent =
    ['ongoing', 'paused'].includes(timerStatus) ||
    (timerStatus === 'done' && repeat) ? (
      <TimerDisplay hms={hms} originalHms={originalHms} />
    ) : (
      <TimerEdit
        repeat={repeat}
        typing={typing}
        timerStatus={timerStatus}
        hms={hms}
        originalHms={originalHms}
        setHms={setHms}
        setOriginalHms={setOriginalHms}
        onUpdateTimerStatus={onUpdateTimerStatus}
        onUpdateTyping={onUpdateTyping}
      />
    );

  return <div className="h-full">{renderContent}</div>;
}
