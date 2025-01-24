import { useEffect, useState } from 'react';
import { Hms as HmsType, TimerStatus } from '../../types';
import { playAudio } from '../../common';

const MAX_VALUE = 1000;
const ERROR_TIMEOUT = 2222;

interface Props {
  timerStatus: TimerStatus;
  hms: HmsType;
  setTimerStatus: React.Dispatch<React.SetStateAction<TimerStatus>>;
  setHms: React.Dispatch<React.SetStateAction<HmsType>>;
  setOriginalHms: React.Dispatch<React.SetStateAction<string>>;
  setIsTimerReady: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Hms({
  timerStatus,
  hms,
  setHms,
  setTimerStatus,
  setOriginalHms,
  setIsTimerReady,
}: Props) {
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (timerStatus === 'done') {
      clearInterval(timer);
      const playSound = async () => {
        await playAudio();
        setTimerStatus('idle');
      };
      playSound();
      return;
    }

    if (timerStatus !== 'playing') return;

    const interval = setInterval(() => {
      setHms((prev) => ({
        ...prev,
        seconds: prev.seconds !== null ? prev.seconds - 1 : 0,
      }));
    }, 1000);

    setTimer(interval);

    return () => clearInterval(interval);
  }, [timerStatus]);

  useEffect(() => {
    const { hours, seconds, minutes } = hms;
    if (typing) setOriginalHms(`${hours ?? 0}:${minutes ?? 0}:${seconds ?? 0}`);

    // Time's up!
    if (
      timerStatus === 'playing' &&
      seconds !== null &&
      seconds < 1 &&
      minutes === 0 &&
      hours === 0
    ) {
      return setTimerStatus('done');
    }

    if (seconds !== null && seconds < 0) {
      // If `seconds` is below `0` and `minutes` is not `0`,
      // then refill `seconds` and decrement `minutes` by `1`.
      if (minutes !== 0) {
        setHms(({ hours, minutes }) => ({
          hours,
          minutes: minutes !== null ? minutes - 1 : 0,
          seconds: 59,
        }));
        return;
      }

      // If `seconds` and `minutes` are both `0`, but `hours` is not,
      // then refill `minutes` and `seconds` and decrement `hours` by `1`.
      if (hours !== 0) {
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
    if (typing || timerStatus === 'playing') return;

    const updateNullToZero = (hms: HmsType): HmsType => ({
      hours: hms.hours ?? 0,
      minutes: hms.minutes ?? 0,
      seconds: hms.seconds ?? 0,
    });

    if (Object.values(hms).some((v) => v === null)) {
      setHms((prev) => updateNullToZero(prev));
    }
  }, [typing]);

  async function setDuration(
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof HmsType
  ) {
    const isEmpty = e.target.value === '';
    const inp = isEmpty ? null : parseInt(e.target.value);
    if (inp !== null && isNaN(inp)) return;

    if (inp !== null && inp > MAX_VALUE) {
      if (!error) {
        setError(`Value must not go over ${MAX_VALUE}.`);
        setTimeout(() => setError(null), ERROR_TIMEOUT);
      }
      return;
    }

    setIsTimerReady(inp !== 0);

    switch (type) {
      case 'hours':
        return setHms((prev) => ({ ...prev, hours: inp }));
      case 'minutes':
        return setHms((prev) => ({ ...prev, minutes: inp }));
      case 'seconds':
        return setHms((prev) => ({ ...prev, seconds: inp }));
    }
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: '12px',
          paddingBlock: '5px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '6px',
            justifyContent: 'center',
            alignItems: 'center',
            width: '30%',
          }}
        >
          <input
            type="text"
            readOnly={timerStatus === 'playing'}
            value={hms.hours ?? ''}
            placeholder={'0-1000'}
            onFocus={() => {
              setTyping(true);
              setHms((prev) => ({ ...prev, hours: prev.hours || null }));
            }}
            onBlur={() => setTyping(false)}
            onChange={(e) => setDuration(e, 'hours')}
            style={{ width: '100%', textAlign: 'right' }}
          />
          <span>h</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '6px',
            justifyContent: 'center',
            alignItems: 'center',
            width: '30%',
          }}
        >
          <input
            type="text"
            readOnly={timerStatus === 'playing'}
            value={hms.minutes ?? ''}
            placeholder={'0-1000'}
            onFocus={() => {
              setTyping(true);
              setHms((prev) => ({ ...prev, minutes: prev.minutes || null }));
            }}
            onBlur={() => setTyping(false)}
            onChange={(e) => setDuration(e, 'minutes')}
            style={{ width: '100%', textAlign: 'right' }}
          />
          <span>m</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '6px',
            justifyContent: 'center',
            alignItems: 'center',
            width: '30%',
          }}
        >
          <input
            type="text"
            readOnly={timerStatus === 'playing'}
            value={hms.seconds ?? ''}
            placeholder={'0-1000'}
            onFocus={() => {
              setTyping(true);
              setHms((prev) => ({ ...prev, seconds: prev.seconds || null }));
            }}
            onBlur={() => setTyping(false)}
            onChange={(e) => setDuration(e, 'seconds')}
            style={{ width: '100%', textAlign: 'right' }}
          />
          <span>s</span>
        </div>
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </>
  );
}
