import { useEffect, useState } from 'react';

import { createAudioPlayer } from '../../utils';
import { Hms as HmsType, TimerStatus } from '../../types';
import { useDebounce } from '../../hooks';

import RoosterSound from '../../assets/audio/hahn_kikeriki.mp3';
import clsx from 'clsx';

const MAX_VALUE = 1000;
const ERROR_TIMEOUT = 2222;

interface Props {
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
  repeat,
  typing,
  timerStatus,
  hms,
  originalHms,
  setHms,
  setOriginalHms,
  onUpdateTyping,
  onUpdateTimerStatus,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number | undefined>(undefined);

  const debouncedTyping = useDebounce(typing, 10);

  const roosterPlayer = createAudioPlayer(RoosterSound);

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

  const onIdle = () => {
    console.log('shohei - idle');
  };

  const onPlay = () => {
    console.log('shohei - play');
    const timer = setInterval(() => {
      setHms((prev) => {
        const secs = prev.seconds ?? 0;
        return {
          ...prev,
          seconds: secs > -1 ? secs - 1 : 0,
        };
      });
    }, 1000);

    setTimer(timer);
  };

  const onPause = () => {
    console.log('shohei - pause');
    clearInterval(timer);
  };

  const onReset = () => {
    console.log('shohei - reset');
    clearInterval(timer);
    const { hours, minutes, seconds } = originalHms;
    setHms({ hours, minutes, seconds });
    onUpdateTimerStatus('idle');
  };

  const onDone = () => {
    console.log('shohei - done');
    clearInterval(timer);

    const onSoundEnd = () => {
      const { hours, minutes, seconds } = originalHms;
      setHms({ hours, minutes, seconds });
      repeat ? onUpdateTimerStatus('ongoing') : onUpdateTimerStatus('done');
    };

    const kikeriki = async () => {
      // Play sound and wait for it to finish
      await roosterPlayer.play(onSoundEnd);
    };

    kikeriki();
  };

  useEffect(() => {
    switch (timerStatus) {
      case 'idle':
        onIdle();
        break;
      case 'ongoing':
        onPlay();
        break;
      case 'paused':
        onPause();
        break;
      case 'reset':
        onReset();
        break;
      case 'done':
        onDone();
        break;
    }

    return () => clearInterval(timer);
  }, [timerStatus]);

  useEffect(() => {
    const ongoing = timerStatus === 'ongoing';
    // AUDITY: wut, this seems wrong lol
    if (!ongoing) return;

    const hrs = hms.hours ?? 0;
    const mins = hms.minutes ?? 0;
    const secs = hms.seconds ?? 0;

    // Time's up!
    const isTimeUp = ongoing && secs < 1 && mins === 0 && hrs === 0;
    if (isTimeUp) {
      return onUpdateTimerStatus('done');
    }

    if (secs < 0) {
      // If `seconds` is below `0` and `minutes` is not `0`,
      // then refill `seconds` and decrement `minutes` by `1`.
      if (mins !== 0) {
        setHms(({ hours, minutes }) => ({
          hours,
          minutes: minutes !== null ? minutes - 1 : 0,
          seconds: 59,
        }));
        return;
      }

      // If `seconds` and `minutes` are both `0`, but `hours` is not,
      // then refill `minutes` and `seconds` and decrement `hours` by `1`.
      if (hrs !== 0) {
        setHms(({ hours }) => ({
          hours: hours !== null ? hours - 1 : 0,
          minutes: 59,
          seconds: 59,
        }));
        return;
      }
    }
  }, [hms]);

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
      <div className="mt-1.5 mb-2 text-sm border-1 border-solid border-black flex gap-3 px-4 py-2">
        <div className="w-[30%] flex gap-0.5">
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
              'w-full text-right',
              timerStatus === 'ongoing' ? 'none' : 'auto',
              'placeholder:!text-sm'
            )}
          />
          <span>h</span>
        </div>
        <div className="w-[30%] flex gap-0.5">
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
              'w-full text-right',
              timerStatus === 'ongoing' ? 'none' : 'auto',
              'placeholder:!text-sm'
            )}
          />
          <span>m</span>
        </div>
        <div className="w-[30%] flex gap-0.5">
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
              'w-full text-right',
              timerStatus === 'ongoing' ? 'none' : 'auto',
              'placeholder:!text-sm'
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
