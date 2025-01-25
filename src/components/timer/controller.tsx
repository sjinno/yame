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
    <div
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        paddingBlock: '5px',
      }}
    >
      <button
        disabled={!isTimerReady || timerStatus === 'ongoing'}
        onClick={() => onUpdateTimerStatus('ongoing')}
      >
        start
      </button>
      <button
        disabled={['idle', 'paused', 'stopped'].includes(timerStatus)}
        onClick={() => onUpdateTimerStatus('paused')}
      >
        pause
      </button>
      <button
        disabled={!(isResettable || timerStatus === 'ongoing')}
        onClick={() => onUpdateTimerStatus('reset')}
      >
        reset
      </button>
      <button onClick={onClear}>clear</button>
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
        <label htmlFor="repeat">repeat</label>
      </div>
    </div>
  );
}
