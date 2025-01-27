import { useEffect, useState } from 'react';

import { Controller } from './controller';
import { formatDuration } from '../../utils/timer';
import { Hms } from './hms';
import { Hms as HmsType, TimerStatus } from '../../types';
import { Label } from './label';
import { ProgressBar } from '../progress-bar';
import { useDebounce } from '../../hooks';

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
  const [typing, setTyping] = useState(false);
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle');

  const debouncedLabel = useDebounce(label, 500);

  useEffect(() => {
    onUpdateTimer(id, debouncedLabel, repeat, hms, originalHms);
    const { hours: h1, minutes: m1, seconds: s1 } = hms;
    const { hours: h2, minutes: m2, seconds: s2 } = originalHms;
    setIsTimerReady([h2, m2, s2].some((v) => !!v));
    setIsTimerResettable(!(h1 === h2 && m1 === m2 && s1 === s2));
  }, [debouncedLabel, hms, originalHms, repeat]);

  const updateLabel = (label: string) => setLabel(label);
  const updateLabelReadonly = (readonly: boolean) => setLabelReadonly(readonly);
  const updateTyping = (typing: boolean) => setTyping(typing);
  const updateTimerStatus = (status: TimerStatus) => setTimerStatus(status);

  const clearHms = () => {
    console.log('clear');
    if (timerStatus !== 'ongoing') {
      setHms({ hours: 0, minutes: 0, seconds: 0 });
      setOriginalHms({ hours: 0, minutes: 0, seconds: 0 });
      setTimerStatus('idle');
    }
  };

  const repeatTimer = () => setRepeat((prev) => !prev);

  return (
    <div className="w-[300px] mx-auto my-6 px-3 pt-2 py-3 border-1 border-black border-solid">
      <div>
        <Label
          label={label}
          labelReadonly={labelReadonly}
          onLabelUpdate={updateLabel}
          onReadonlyUpdate={updateLabelReadonly}
        />
        <div>
          <div className="my-1.5">
            <div className="text-xs ml-0.5">time remaining:</div>
            <div className="text-5xl mt-0.5">
              {formatDuration(hms.hours ?? 0)}:
              {formatDuration(hms.minutes ?? 0)}:
              {formatDuration(hms.seconds ?? 0)}
            </div>
          </div>
          <ProgressBar hms={hms} originalHms={originalHms} />
        </div>
        <Hms
          repeat={repeat}
          typing={typing}
          timerStatus={timerStatus}
          hms={hms}
          originalHms={originalHms}
          setHms={setHms}
          setOriginalHms={setOriginalHms}
          onUpdateTimerStatus={updateTimerStatus}
          onUpdateTyping={updateTyping}
        />
        <Controller
          isTimerReady={isTimerReady}
          isResettable={isTimerResettable}
          repeat={repeat}
          timerStatus={timerStatus}
          onClear={clearHms}
          onRepeat={repeatTimer}
          onUpdateTimerStatus={updateTimerStatus}
        />
      </div>
      <div style={{ textAlign: 'center', paddingTop: '5px' }}>
        <button
          className="text-sm border-1 border-solid border-black px-1.5 y-0.5"
          onClick={onRemove}
        >
          remove
        </button>
      </div>
    </div>
  );
}
