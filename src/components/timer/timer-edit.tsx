import { useEffect, useState } from 'react';

import { Hms as HmsType, TimerStatus } from '../../types';
import { useDebounce } from '../../hooks';

import clsx from 'clsx';

const MAX_VALUE = 1000;
const ERROR_TIMEOUT = 2222;

export interface TimerEditProps {
  repeat: boolean;
  typing: boolean;
  timerStatus: TimerStatus;
  hms: HmsType;
  originalHms: HmsType;
  setHms: React.Dispatch<React.SetStateAction<HmsType>>;
  setOriginalHms: React.Dispatch<React.SetStateAction<HmsType>>;
  onUpdateTyping: (typing: boolean) => void;
  onUpdateTimerStatus: (status: TimerStatus) => void;
}

export function TimerEdit({
  typing,
  timerStatus,
  hms,
  originalHms,
  setHms,
  setOriginalHms,
  onUpdateTyping,
  onUpdateTimerStatus,
}: TimerEditProps) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedTyping = useDebounce(typing, 10);

  const updateZeroToNull = (hms: HmsType): HmsType => ({
    hours: hms.hours || null,
    minutes: hms.minutes || null,
    seconds: hms.seconds || null,
  });

  const updateNullToZero = (hms: HmsType): HmsType => ({
    hours: hms.hours ?? 0,
    minutes: hms.minutes ?? 0,
    seconds: hms.seconds ?? 0,
  });

  const setDuration = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof HmsType
  ) => {
    const isEmpty = e.target.value === '';
    const inp = isEmpty ? null : parseInt(e.target.value);

    // If `inp` is not `null` and not a number, then do nothing.
    if (inp !== null && isNaN(inp)) return;

    // If `inp` is not `null` and greater than `MAX_VALUE`,
    // display an error message and return.
    if (inp !== null && inp > MAX_VALUE) {
      if (!error) {
        setError(`Value must not go over ${MAX_VALUE}.`);
        setTimeout(() => setError(null), ERROR_TIMEOUT);
      }
      return;
    }

    switch (type) {
      case 'hours':
        return setOriginalHms((prev) => ({ ...prev, hours: inp }));
      case 'minutes':
        return setOriginalHms((prev) => ({ ...prev, minutes: inp }));
      case 'seconds':
        return setOriginalHms((prev) => ({ ...prev, seconds: inp }));
    }
  };

  const handleFocus = () => timerStatus !== 'ongoing' && onUpdateTyping(true);
  const handleBlur = () => onUpdateTyping(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // If this is the first time loading, don't update the current timer.
    if (!mounted) return;
    setHms(originalHms);
  }, [originalHms]);

  useEffect(() => {
    if (debouncedTyping && timerStatus === 'paused') {
      setOriginalHms(hms);
    }

    // If `debouncedTyping` is `true`, then replace `0` with `null`?
    if (debouncedTyping) {
      if (Object.values(originalHms).some((v) => v === 0)) {
        setOriginalHms((prev) => updateZeroToNull(prev));
      }
      return;
    }

    // If `debouncedTyping` is `false`, then replace `null` with `0`.
    if (Object.values(originalHms).some((v) => v === null)) {
      setOriginalHms((prev) => updateNullToZero(prev));
    }
  }, [debouncedTyping]);

  const startTimerOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onUpdateTimerStatus('ongoing');
      onUpdateTyping(false);
    }
  };

  return (
    <>
      <div className="w-full h-full flex justify-center items-center text-2xl gap-1">
        <div className="w-[30%] flex gap-1">
          <input
            type="text"
            readOnly={timerStatus === 'ongoing'}
            value={originalHms.hours ?? ''}
            placeholder={'0-1000'}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setDuration(e, 'hours')}
            onKeyDown={startTimerOnEnter}
            className={clsx(
              'w-full text-center',
              timerStatus === 'ongoing' ? 'none' : 'auto',
              'placeholder:!text-sm',
              'focus:outline-1 focus:outline-solid focus:outline-blue-600 focus:text-center focus:outline-offset-0 focus:border-transparent',
              'border-1 border-solid border-black'
            )}
          />
          <span>h</span>
        </div>
        <div className="w-[30%] flex gap-1">
          <input
            type="text"
            readOnly={timerStatus === 'ongoing'}
            value={originalHms.minutes ?? ''}
            placeholder={'0-1000'}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setDuration(e, 'minutes')}
            onKeyDown={startTimerOnEnter}
            className={clsx(
              'w-full text-center',
              timerStatus === 'ongoing' ? 'none' : 'auto',
              'placeholder:!text-sm',
              'focus:outline-1 focus:outline-solid focus:outline-blue-600 focus:text-center focus:outline-offset-0 focus:border-transparent',
              'border-1 border-solid border-black'
            )}
          />
          <span>m</span>
        </div>
        <div className="w-[30%] flex gap-1">
          <input
            type="text"
            readOnly={timerStatus === 'ongoing'}
            value={originalHms.seconds ?? ''}
            placeholder={'0-1000'}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setDuration(e, 'seconds')}
            onKeyDown={startTimerOnEnter}
            className={clsx(
              'w-full text-center',
              timerStatus === 'ongoing' ? 'none' : 'auto',
              'placeholder:!text-sm',
              'focus:outline-1 focus:outline-solid focus:outline-blue-600 focus:text-center focus:outline-offset-0 focus:border-transparent',
              'border-1 border-solid border-black'
            )}
          />
          <span>s</span>
        </div>
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </>
  );
}

// function Input() {
//   return <></>;
// }
