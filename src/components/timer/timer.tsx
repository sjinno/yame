import { useEffect, useState } from 'react';
import { Label } from './label';
import { Hms } from './hms';
import { Controller } from './controller';
import { Pause } from '../../types';
import { useDebounce } from '../../hooks';

interface Props {
  id: string;
  onRemove: () => void;
}

export function Timer({ id, onRemove }: Props) {
  const [labelReadonly, setLabelReadonly] = useState(true);
  const [label, setLabel] = useState<string>('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [play, setPlay] = useState(false);
  const [pause, setPause] = useState<Pause>(null);
  const [repeat, setRepeat] = useState(false);
  const [isTimerReady, setIsTimerReady] = useState(false);

  const debouncedLabel = useDebounce(label, 500);

  useEffect(() => {
    async () => {
      // await updateTimer(id, { field: value} );
    };
  }, [debouncedLabel]);

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
      <button onClick={onRemove}>remove</button>
    </div>
  );
}
