import { useEffect, useState } from 'react';

import { Controller } from './controller';
import { TimerEdit } from './timer-edit';
import { Hms as HmsType, TimerStatus } from '../../types';
import { Label } from './label';
import { useDebounce } from '../../hooks';
import clsx from 'clsx';
import { TimerDisplay } from './timer-display';
import { TimerCard } from './timer-card';
import { TimerBody } from './timer-body';
import { TimerFooter } from './timer-footer';
import { LabelProps, TimerHeader } from './timer-header';

import './timer-card.scss';

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

  const labelProps = {
    label,
    labelReadonly,
    updateLabel,
    updateLabelReadonly,
  } satisfies LabelProps;

  return (
    <TimerCard
      headerChildren={<TimerHeader {...labelProps} />}
      bodyChildren={<TimerBody />}
      footerChildren={<TimerFooter />}
    />
  );
}

{
  /* <div
    className={clsx(
      'w-[300px] mx-auto my-6 px-3 pt-2 py-3',
      'border-1 border-black border-solid',
      timerStatus === 'ongoing' && 'bg-emerald-100',
      timerStatus === 'paused' && 'bg-amber-100',
      timerStatus === 'done' && 'bg-sky-100'
    )}
  >
    <div></div>
    <div style={{ textAlign: 'center', paddingTop: '5px' }}>
      <button
        className="text-sm border-1 border-solid border-black px-1.5 y-0.5"
        // TODO: show a toast saying that it has to be paused before doing the remove action or you can change the behavior in the user settings
        disabled={timerStatus === 'ongoing'}
        onClick={onRemove}
      >
        remove
      </button>
    </div>
  </div> */
}
