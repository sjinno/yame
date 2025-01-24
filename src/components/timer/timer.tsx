import { useEffect, useState } from 'react';
import { Label } from './label';
import { Hms } from './hms';
import { Controller } from './controller';
import { Hms as HmsType, Pause, Timer as TimerType } from '../../types';
import { useDebounce } from '../../hooks';

export type TimerField = 'label' | 'hours' | 'minutes' | 'seconds';

interface Props {
  id: string;
  label: string;
  hms: HmsType;
  timers: TimerType[];
  onRemove: () => void;
  onUpdateTimer: (
    id: string,
    label: string,
    hours: number,
    minutes: number,
    seconds: number,
    repeat: boolean
  ) => void;
}

export function Timer({
  id,
  label: label_,
  hms,
  onRemove,
  onUpdateTimer,
}: Props) {
  const [labelReadonly, setLabelReadonly] = useState(true);
  const [label, setLabel] = useState<string>(label_);
  const [hours, setHours] = useState(hms.hours);
  const [minutes, setMinutes] = useState(hms.minutes);
  const [seconds, setSeconds] = useState(hms.seconds);
  const [play, setPlay] = useState(false);
  const [pause, setPause] = useState<Pause>(null);
  const [repeat, setRepeat] = useState(false);
  const [isTimerReady, setIsTimerReady] = useState(false);

  const debouncedLabel = useDebounce(label, 500);

  useEffect(() => {
    onUpdateTimer(id, debouncedLabel, hours, minutes, seconds, repeat);
  }, [debouncedLabel, hours, minutes, seconds, repeat]);

  return (
    <div
      style={{
        border: '1px solid black',
        padding: '10px 15px',
        marginBlock: '15px',
      }}
    >
      <div>
        <Label
          label={label}
          setLabel={setLabel}
          labelReadonly={labelReadonly}
          setLabelReadonly={setLabelReadonly}
        />
        <Hms
          play={play}
          hours={hours}
          setHours={setHours}
          minutes={minutes}
          setMinutes={setMinutes}
          seconds={seconds}
          setSeconds={setSeconds}
          setIsTimerReady={setIsTimerReady}
        />
        <Controller
          isTimerReady={isTimerReady}
          play={play}
          setPlay={setPlay}
          pause={pause}
          setPause={setPause}
          repeat={repeat}
          setRepeat={setRepeat}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={onRemove}>remove</button>
      </div>
    </div>
  );
}
