import { useEffect, useState } from 'react';
import { Label } from './label';
import { Hms } from './hms';
import { Controller } from './controller';
import { Hms as HmsType, TimerStatus } from '../../types';
import { useDebounce } from '../../hooks';

export type TimerField = 'label' | 'hours' | 'minutes' | 'seconds';

interface Props {
  id: string;
  label: string;
  hms: HmsType;
  originalHms: HmsType;
  repeat: boolean;
  onRemove: () => void;
  onUpdateTimer: (
    id: string,
    label: string,
    hms: HmsType,
    orignalHms: HmsType,
    repeat: boolean
  ) => void;
}

export function Timer({
  id,
  label: label_,
  hms: hms_,
  originalHms: originalHms_,
  repeat: repeat_,
  onRemove,
  onUpdateTimer,
}: Props) {
  const [labelReadonly, setLabelReadonly] = useState(true);
  const [label, setLabel] = useState<string>(label_);
  const [hms, setHms] = useState(hms_);
  const [originalHms, setOriginalHms] = useState(originalHms_);
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle');
  const [repeat, setRepeat] = useState(repeat_);
  const [isTimerReady, setIsTimerReady] = useState(false);
  const [isResettable, setIsResettable] = useState(false);

  const debouncedLabel = useDebounce(label, 500);

  useEffect(() => {
    onUpdateTimer(id, debouncedLabel, hms, originalHms, repeat);
    const { hours: h1, minutes: m1, seconds: s1 } = hms;
    const { hours: h2, minutes: m2, seconds: s2 } = originalHms;
    setIsTimerReady([h2, m2, s2].some((v) => !!v));
    setIsResettable(!(h1 === h2 && m1 === m2 && s1 === s2));
  }, [debouncedLabel, hms, originalHms, repeat]);

  useEffect(() => {
    if (timerStatus === 'stopped') {
      const { hours, minutes, seconds } = originalHms;
      setHms({ hours, minutes, seconds });
      setTimerStatus('idle');
    }
  }, [timerStatus]);

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
        <div style={{ display: 'flex', gap: '10px', fontSize: '3.2rem' }}>
          <p>
            Timer:{' '}
            <b>
              {hms.hours ?? 0}:{hms.minutes ?? 0}:{hms.seconds ?? 0}
            </b>
          </p>
          {/* <p>|</p>
          <p>Time exceeding: </p> */}
        </div>
        <Hms
          repeat={repeat}
          timerStatus={timerStatus}
          hms={hms}
          originalHms={originalHms}
          setHms={setHms}
          setTimerStatus={setTimerStatus}
          setIsTimerReady={setIsTimerReady}
          setOriginalHms={setOriginalHms}
        />
        <Controller
          isTimerReady={isTimerReady}
          isResettable={isResettable}
          repeat={repeat}
          timerStatus={timerStatus}
          setRepeat={setRepeat}
          setTimerStatus={setTimerStatus}
          onClear={() => {
            if (timerStatus !== 'playing') {
              setHms({ hours: 0, minutes: 0, seconds: 0 });
              setOriginalHms({ hours: 0, minutes: 0, seconds: 0 });
            }
          }}
        />
      </div>
      <div style={{ textAlign: 'center', paddingTop: '5px' }}>
        <button onClick={onRemove}>remove</button>
      </div>
    </div>
  );
}
