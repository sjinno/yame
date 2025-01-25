import { useEffect, useState } from 'react';
import { Label } from './label';
import { Hms } from './hms';
import { Controller } from './controller';
import { Hms as HmsType, TimerStatus } from '../../types';
import { useDebounce } from '../../hooks';
import { ProgressBar } from '../progress-bar';
import { formatDuration } from '../../utils/timer';

export type TimerField = 'label' | 'hours' | 'minutes' | 'seconds';

interface Props {
  id: string;
  label: string;
  repeat: boolean;
  hms: HmsType;
  originalHms: HmsType;
  onRemove: () => void;
  onUpdateTimer: (
    id: string,
    label: string,
    repeat: boolean,
    hms: HmsType,
    orignalHms: HmsType
  ) => void;
}

export function Timer({
  id,
  label: label_,
  repeat: repeat_,
  hms: hms_,
  originalHms: originalHms_,
  onRemove,
  onUpdateTimer,
}: Props) {
  const [label, setLabel] = useState<string>(label_);
  const [repeat, setRepeat] = useState(repeat_);
  const [hms, setHms] = useState(hms_);
  const [originalHms, setOriginalHms] = useState(originalHms_);

  const [labelReadonly, setLabelReadonly] = useState(true);
  const [isTimerReady, setIsTimerReady] = useState(false);
  const [isTimerResettable, setIsTimerResettable] = useState(false);
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle');

  const debouncedLabel = useDebounce(label, 500);

  useEffect(() => {
    onUpdateTimer(id, debouncedLabel, repeat, hms, originalHms);
    const { hours: h1, minutes: m1, seconds: s1 } = hms;
    const { hours: h2, minutes: m2, seconds: s2 } = originalHms;
    setIsTimerReady([h2, m2, s2].some((v) => !!v));
    setIsTimerResettable(!(h1 === h2 && m1 === m2 && s1 === s2));
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
        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            fontSize: '4.2rem',
            marginBlock: '5px',
          }}
        >
          <span style={{ fontSize: '2.8rem' }}>Timer:</span>{' '}
          <b>
            {formatDuration(hms.hours ?? 0)}:{formatDuration(hms.minutes ?? 0)}:
            {formatDuration(hms.seconds ?? 0)}
          </b>
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
          isResettable={isTimerResettable}
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
        <ProgressBar hms={hms} originalHms={originalHms} />
      </div>
      <div style={{ textAlign: 'center', paddingTop: '5px' }}>
        <button onClick={onRemove}>remove</button>
      </div>
    </div>
  );
}
