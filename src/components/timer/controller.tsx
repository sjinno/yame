import { TimerStatus } from '../../types';

interface Props {
  isTimerReady: boolean;
  isResettable: boolean;
  repeat: boolean;
  timerStatus: TimerStatus;
  onClear: () => void;
  onRepeat: () => void;
  onUpdateTimerStatus: (status: TimerStatus) => void;
}

export function Controller({
  isResettable,
  isTimerReady,
  repeat,
  timerStatus,
  onClear,
  onRepeat,
  onUpdateTimerStatus,
}: Props) {
  return (
    <div className="flex gap-[10px] align-middle py-[5px] text-sm ml-0.5">
      <button
        className="border-1 border-solid border-black px-1"
        disabled={!isTimerReady || timerStatus === 'ongoing'}
        onClick={() => onUpdateTimerStatus('ongoing')}
      >
        start
      </button>
      <button
        className="border-1 border-solid border-black px-1"
        disabled={['idle', 'paused', 'stopped'].includes(timerStatus)}
        onClick={() => onUpdateTimerStatus('paused')}
      >
        pause
      </button>
      <button
        className="border-1 border-solid border-black px-1"
        disabled={!isResettable}
        onClick={() => onUpdateTimerStatus('reset')}
      >
        reset
      </button>
      <button
        className="border-1 border-solid border-black px-1"
        disabled={timerStatus === 'ongoing'}
        onClick={onClear}
      >
        clear
      </button>
      <div
        style={{
          display: 'flex',
          gap: '5px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <input
          type="checkbox"
          name="repeat"
          id="repeat"
          checked={repeat}
          onChange={onRepeat}
        />
        <label htmlFor="repeat" className="mt-[-2px]">
          repeat
        </label>
      </div>
    </div>
  );
}
