import { useEffect, useState } from 'react';
import { Hms as HmsType, TimerStatus } from '../../types';
import { createAudioPlayer } from '../../utils';
import RoosterSound from '../../assets/audio/hahn_kikeriki.mp3';

const MAX_VALUE = 1000;
const ERROR_TIMEOUT = 2222;

interface Props {
  repeat: boolean;
  timerStatus: TimerStatus;
  hms: HmsType;
  originalHms: HmsType;
  setTimerStatus: React.Dispatch<React.SetStateAction<TimerStatus>>;
  setHms: React.Dispatch<React.SetStateAction<HmsType>>;
  setOriginalHms: React.Dispatch<React.SetStateAction<HmsType>>;
  setIsTimerReady: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Hms({
  repeat,
  timerStatus,
  hms,
  originalHms,
  setHms,
  setTimerStatus,
  setOriginalHms,
  setIsTimerReady,
}: Props) {
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number | undefined>(undefined);

  const roosterPlayer = createAudioPlayer(RoosterSound);

  useEffect(() => {
    if (timerStatus === 'done') {
      clearInterval(timer);

      const onSoundEnd = () => {
        const { hours, minutes, seconds } = originalHms;
        setHms({ hours, minutes, seconds });
        if (repeat) {
          setTimerStatus('playing');
        } else {
          setTimerStatus('idle');
        }
      };

      const kikeriki = async () => {
        // Play sound and wait for it to finish
        await roosterPlayer.play(onSoundEnd);
      };
      kikeriki();

      return;
    }

    if (timerStatus == 'playing') {
      const interval = setInterval(() => {
        setHms((prev) => ({
          ...prev,
          seconds: prev.seconds !== null ? prev.seconds - 1 : 0,
        }));
      }, 1000);

      setTimer(interval);

      return () => clearInterval(interval);
    }
  }, [timerStatus]);

  useEffect(() => {
    if (timerStatus !== 'playing') return;

    const { hours, seconds, minutes } = hms;

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

  const updateZeroToNull = (hms: HmsType): HmsType => ({
    hours: hms.hours || null,
    minutes: hms.minutes || null,
    seconds: hms.seconds || null,
  });

  useEffect(() => {
    if (typing && timerStatus === 'paused') {
      setOriginalHms(hms);
    }

    // If `typing` is `true`, then replace `0` with `null`?
    if (typing) {
      if (Object.values(originalHms).some((v) => v === 0)) {
        setOriginalHms((prev) => updateZeroToNull(prev));
      }
      return;
    }

    // If `typing` is `false`, then replace `null` with `0`.
    {
      const updateNullToZero = (hms: HmsType): HmsType => ({
        hours: hms.hours ?? 0,
        minutes: hms.minutes ?? 0,
        seconds: hms.seconds ?? 0,
      });

      if (Object.values(originalHms).some((v) => v === null)) {
        setOriginalHms((prev) => updateNullToZero(prev));
      }
    }
  }, [typing]);

  useEffect(() => {
    if (!typing) {
      setHms(originalHms);
      return;
    }

    if (typing && timerStatus === 'paused') {
      if (Object.values(originalHms).some((v) => v === 0)) {
        setOriginalHms((prev) => updateZeroToNull(prev));
      }
      return;
    }
  }, [originalHms]);

  useEffect(() => {
    if (typing) {
      setHms(originalHms);
    }
  }, [originalHms]);

  async function setDuration(
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof HmsType
  ) {
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

    // This is fine, but I can probably move this some other place
    // that makes more sense to call this from.
    setIsTimerReady(inp !== 0);

    switch (type) {
      case 'hours':
        return setOriginalHms((prev) => ({ ...prev, hours: inp }));
      case 'minutes':
        return setOriginalHms((prev) => ({ ...prev, minutes: inp }));
      case 'seconds':
        return setOriginalHms((prev) => ({ ...prev, seconds: inp }));
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
            value={originalHms.hours ?? ''}
            placeholder={'0-1000'}
            onFocus={() => timerStatus !== 'playing' && setTyping(true)}
            onBlur={() => setTyping(false)}
            onChange={(e) => setDuration(e, 'hours')}
            style={{
              width: '100%',
              textAlign: 'right',
              pointerEvents: timerStatus === 'playing' ? 'none' : 'auto',
            }}
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
            value={originalHms.minutes ?? ''}
            placeholder={'0-1000'}
            onFocus={() => timerStatus !== 'playing' && setTyping(true)}
            onBlur={() => setTyping(false)}
            onChange={(e) => setDuration(e, 'minutes')}
            style={{
              width: '100%',
              textAlign: 'right',
              pointerEvents: timerStatus === 'playing' ? 'none' : 'auto',
            }}
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
            value={originalHms.seconds ?? ''}
            placeholder={'0-1000'}
            onFocus={() => timerStatus !== 'playing' && setTyping(true)}
            onBlur={() => setTyping(false)}
            onChange={(e) => setDuration(e, 'seconds')}
            style={{
              width: '100%',
              textAlign: 'right',
              pointerEvents: timerStatus === 'playing' ? 'none' : 'auto',
            }}
          />
          <span>s</span>
        </div>
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </>
  );
}
