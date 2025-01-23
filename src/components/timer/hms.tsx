import { useEffect, useState } from 'react';
import { Hms as HmsType } from '../../bindings/Hms';

const MAX_VALUE = 1000;
const ERROR_TIMEOUT = 2222;

type EmptyString = '';

interface Props {
  play: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  setHours: React.Dispatch<React.SetStateAction<number>>;
  setMinutes: React.Dispatch<React.SetStateAction<number>>;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
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
  setIsTimerReady,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number | undefined>(undefined);

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
        console.log('shohei - minutes', minutes);
        setMinutes((prev) => prev - 1);
        setSeconds(59);
        return;
      }

      if (hours !== 0) {
        console.log('shohei - hours', hours);
        setHours((prev) => prev - 1);
        setMinutes(59);
        setSeconds(59);
        return;
      }
    }
  }, [seconds]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>, type: HmsType) {
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
      case 'Hours':
        return setHours(inp);
      case 'Minutes':
        return setMinutes(inp);
      case 'Seconds':
        return setSeconds(inp);
    }
  }

  function formatDuration(d: number): EmptyString | number {
    return d === 0 && !play ? '' : d;
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: '5px',
          paddingBlock: '5px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '2.5px',
            justifyContent: 'center',
            alignItems: 'center',
            width: '30%',
          }}
        >
          <input
            type="text"
            readOnly={play}
            value={formatDuration(hours)}
            onChange={(e) => handleInput(e, 'Hours')}
            placeholder={`hr (1-${MAX_VALUE})`}
            style={{ width: '100%', textAlign: 'right' }}
          />
          <span>h</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '2.5px',
            justifyContent: 'center',
            alignItems: 'center',
            width: '30%',
          }}
        >
          <input
            type="text"
            readOnly={play}
            value={formatDuration(minutes)}
            onChange={(e) => handleInput(e, 'Minutes')}
            placeholder={`min (1-${MAX_VALUE})`}
            style={{ width: '100%', textAlign: 'right' }}
          />
          <span>m</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '2.5px',
            justifyContent: 'center',
            alignItems: 'center',
            width: '30%',
          }}
        >
          <input
            type="text"
            readOnly={play}
            value={formatDuration(seconds)}
            onChange={(e) => handleInput(e, 'Seconds')}
            placeholder={`sec (1-${MAX_VALUE})`}
            style={{ width: '100%', textAlign: 'right' }}
          />
          <span>s</span>
        </div>
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </>
  );
}
