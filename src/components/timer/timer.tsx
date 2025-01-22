import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { Label } from './label';
import { Hms } from './hms';
import { Controller } from './controller';

export type Pause = 'paused' | 'unpaused' | null;

export const Timer = () => {
  const [labelReadonly, setLabelReadonly] = useState(true);
  const [label, setLabel] = useState<string>('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [play, setPlay] = useState(false);
  const [pause, setPause] = useState<Pause>(null);
  const [repeat, setRepeat] = useState(false);
  const [isTimerReady, setIsTimerReady] = useState(false);

  return (
    <div style={{ border: '1px solid black', padding: '10px 15px' }}>
      <Label
        label={label}
        setLabel={setLabel}
        labelReadonly={labelReadonly}
        setLabelReadonly={setLabelReadonly}
      />
      <Hms
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
  );
};
