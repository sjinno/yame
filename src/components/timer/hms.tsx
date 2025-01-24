import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { HmsKind } from '../../types';
import { playAudio } from '../../common';

type FocusType = 'focus' | 'blur';

const MAX_VALUE = 1000;
const ERROR_TIMEOUT = 2222;

interface Props {
  play: boolean;
  hours: number | null;
  minutes: number | null;
  seconds: number | null;
  setHours: React.Dispatch<React.SetStateAction<number | null>>;
  setMinutes: React.Dispatch<React.SetStateAction<number | null>>;
  setSeconds: React.Dispatch<React.SetStateAction<number | null>>;
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
  const [done, setDone] = useState(false);
  const hoursRef = useRef<HTMLInputElement | null>(null);
  const minutesRef = useRef<HTMLInputElement | null>(null);
  const secondsRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!play) return;

    const interval = setInterval(() => {
      setSeconds((prev) => (prev !== null ? prev - 1 : 0));
    }, 1000);

    setTimer(interval);

    return () => clearInterval(interval);
  }, [play]);

  useEffect(() => {
    if (done) {
      clearInterval(timer);
      const playSound = async () => {
        // await playAudio();
        setDone(false);
      };
      playSound();
    }
  }, [done]);

  useEffect(() => {
    console.log('shohei - {hours,minutes,seconds}', {
      hours,
      minutes,
      seconds,
    });
    if (seconds !== null && seconds < 1 && minutes === 0 && hours === 0) {
      return setDone(true);
    }

    if (seconds !== null && seconds < 0) {
      if (minutes !== 0) {
        setMinutes((prev) => (prev !== null ? prev - 1 : 0));
        setSeconds(59);
        return;
      }

      if (hours !== 0) {
        setHours((prev) => (prev !== null ? prev - 1 : 0));
        setMinutes(59);
        setSeconds(59);
        return;
      }
    }
  }, [seconds]);

  useEffect(() => {
    setOriginalHms(`${hours}:${minutes}:${seconds ?? 0}`);
  }, [hours, minutes, seconds]);

  useEffect(() => {
    const refs = [
      { value: hours, ref: hoursRef },
      { value: minutes, ref: minutesRef },
      { value: seconds, ref: secondsRef },
    ];

    if (typing) {
      refs.forEach(({ value, ref }) => {
        const isFocused = ref.current === document.activeElement;
        if (value === 0 && ref.current && isFocused) {
          ref.current.value = '';
        }
      });
    } else {
      if (hours === null) setHours(0);
      if (minutes === null) setMinutes(0);
      if (seconds === null) setSeconds(0);
    }
  }, [typing]);

  async function setDuration(
    e: React.ChangeEvent<HTMLInputElement>,
    type: HmsKind
  ) {
    const isEmpty = e.target.value === '';
    const inp = isEmpty ? null : parseInt(e.target.value);
    if (inp && isNaN(inp)) return;

    if (inp && inp > MAX_VALUE) {
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
            value={hours ?? ''}
            onFocus={() => setTyping(true)}
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
            ref={minutesRef}
            type="text"
            readOnly={play}
            value={minutes ?? ''}
            onFocus={() => setTyping(true)}
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
            ref={secondsRef}
            type="text"
            readOnly={play}
            value={seconds ?? ''}
            onFocus={() => setTyping(true)}
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
