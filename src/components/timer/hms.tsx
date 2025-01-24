import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { HmsKind } from '../../types';

type FocusType = 'focus' | 'blur';

const MAX_VALUE = 1000;
const ERROR_TIMEOUT = 2222;

interface Props {
  play: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  setHours: React.Dispatch<React.SetStateAction<number>>;
  setMinutes: React.Dispatch<React.SetStateAction<number>>;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
  setOriginalHms: React.Dispatch<React.SetStateAction<string>>;
  setIsTimerReady: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Hms({
  play,
  hours,
  minutes,
  seconds,
  setHours,
  setMinutes,
  setSeconds,
  setOriginalHms,
  setIsTimerReady,
}: Props) {
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number | undefined>(undefined);
  const hoursRef = useRef<HTMLInputElement | null>(null);
  const minutesRef = useRef<HTMLInputElement | null>(null);
  const secondsRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!play) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    setTimer(interval);

    return () => clearInterval(interval);
  }, [play]);

  useEffect(() => {
    if (seconds < 1 && minutes === 0 && hours === 0) {
      clearInterval(timer);
      return;
    }

    if (seconds < 0) {
      if (minutes !== 0) {
        setMinutes((prev) => prev - 1);
        setSeconds(59);
        return;
      }

      if (hours !== 0) {
        setHours((prev) => prev - 1);
        setMinutes(59);
        setSeconds(59);
        return;
      }
    }
  }, [seconds]);

  useEffect(() => {
    if (typing) setOriginalHms(`${hours}:${minutes}:${seconds}`);
    setTyping(false);
  }, [typing]);

  async function setDuration(
    e: React.ChangeEvent<HTMLInputElement>,
    type: HmsKind
  ) {
    setTyping(true);

    const isEmpty = e.target.value === '';
    const inp = isEmpty ? 0 : parseInt(e.target.value);
    if (isNaN(inp)) return;

    if (inp > MAX_VALUE) {
      if (!error) {
        setError(`Value must not go over ${MAX_VALUE}.`);
        setTimeout(() => setError(null), ERROR_TIMEOUT);
      }
      return;
    }

    setIsTimerReady(inp !== 0);

    switch (type) {
      case 'hours':
        setHours(inp);
        break;
      case 'minutes':
        setMinutes(inp);
        break;
      case 'seconds':
        setSeconds(inp);
        break;
    }
  }

  function formatDuration(
    ref: MutableRefObject<HTMLInputElement | null>,
    focusType: FocusType
  ) {
    const elt = ref.current;
    if (!elt) return;
    if (focusType === 'focus' && elt.value === '0') return (elt.value = '');
    if (focusType === 'blur' && elt.value === '') return (elt.value = '0');
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
            ref={hoursRef}
            type="text"
            readOnly={play}
            value={hours}
            onFocus={() => formatDuration(hoursRef, 'focus')}
            onBlur={() => formatDuration(hoursRef, 'blur')}
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
            ref={minutesRef}
            type="text"
            readOnly={play}
            value={minutes}
            onFocus={() => formatDuration(minutesRef, 'focus')}
            onBlur={() => formatDuration(minutesRef, 'blur')}
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
            ref={secondsRef}
            type="text"
            readOnly={play}
            value={seconds}
            onFocus={() => formatDuration(secondsRef, 'focus')}
            onBlur={() => formatDuration(secondsRef, 'blur')}
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
