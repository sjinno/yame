import {
  CirclePauseIcon,
  CirclePlayIcon,
  Repeat2Icon,
  RotateCcwIcon,
} from 'lucide-react';
import { TimerStatus } from '../../types';
import clsx from 'clsx';

export interface ControllerProps {
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
}: ControllerProps) {
  const scaleIcon = 'scale-75';
  const scaleIcon2 = 'scale-[64%]';

  return (
    <div className="flex gap-2 justify-center items-center text-sm">
      <button
        disabled={!isTimerReady || timerStatus === 'ongoing'}
        onClick={() => {
          console.log('shohei - boop');
          onUpdateTimerStatus('ongoing');
        }}
      >
        <CirclePlayIcon className={clsx(scaleIcon)} />
      </button>
      <button
        disabled={['idle', 'paused', 'stopped'].includes(timerStatus)}
        onClick={() => onUpdateTimerStatus('paused')}
      >
        <CirclePauseIcon className={clsx(scaleIcon)} />
      </button>
      <button
        disabled={!isResettable}
        onClick={() => onUpdateTimerStatus('reset')}
      >
        <RotateCcwIcon className={clsx(scaleIcon2)} />
      </button>
      <button
        className={clsx(
          'bg-zinc-800 text-white capitalize tracking-wide rounded-4xl px-2 py-[1.5px] font-semibold text-xs h-[68%]'
        )}
        disabled={timerStatus === 'ongoing'}
        onClick={onClear}
      >
        clear
      </button>
      <div
        className={clsx(
          'flex justify-center items-center rounded-full',
          repeat ? 'bg-blue-600' : 'bg-white',
          repeat ? 'text-white' : 'text-black'
        )}
      >
        <Repeat2Icon className={clsx(scaleIcon2)} onClick={onRepeat} />
      </div>
    </div>
  );
}
