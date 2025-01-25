import { TimerStatus } from '../../types';

interface Props {
  isTimerReady: boolean;
  isResettable: boolean;
  repeat: boolean;
  timerStatus: TimerStatus;
  setRepeat: React.Dispatch<React.SetStateAction<boolean>>;
  setTimerStatus: React.Dispatch<React.SetStateAction<TimerStatus>>;
  onClear: () => void;
}

export function Controller({
  isTimerReady,
  isResettable,
  repeat,
  timerStatus,
  setRepeat,
  setTimerStatus,
  onClear,
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
        disabled={!isTimerReady || timerStatus === 'playing'}
        onClick={() => setTimerStatus('playing')}
      >
        start
      </button>
      <button
        disabled={['idle', 'paused', 'stopped'].includes(timerStatus)}
        onClick={() => setTimerStatus('paused')}
      >
        pause
      </button>
      <button
        disabled={!(isResettable || timerStatus === 'playing')}
        onClick={() => setTimerStatus('stopped')}
      >
        stop & reset
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
          onChange={() => setRepeat((prev) => !prev)}
        />
        <label htmlFor="repeat">repeat</label>
      </div>
    </div>
  );
}
