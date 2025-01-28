import { useEffect, useRef, useState } from 'react';

import { ControllerProps } from './controller';
import { createAudioPlayer } from '../../utils';
import { Hms as HmsType, TimerStatus } from '../../types';
import { LabelProps } from './label';
import { useDebounce } from '../../hooks';
import { TimerCard } from './timer-card';
import { TimerBody, TimerBodyProps } from './timer-body';
import { TimerFooter } from './timer-footer';
import { TimerHeader } from './timer-header';

import RoosterSound from '../../assets/audio/hahn_kikeriki.mp3';
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

  const timerRef = useRef<number | null>(null);
  const roosterPlayer = createAudioPlayer(RoosterSound);

  // Cleanup when the component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      roosterPlayer.drop();
    };
  }, []);

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

  const onIdle = () => {
    console.log('shohei - idle');
  };

  const onPlay = () => {
    console.log('shohei - play');
    if (timerRef.current) clearInterval(timerRef.current); // Ensure no duplicate intervals

    timerRef.current = setInterval(() => {
      setHms((prev) => {
        const secs = prev.seconds ?? 0;
        return {
          ...prev,
          seconds: secs > -1 ? secs - 1 : 0,
        };
      });
    }, 1000);
  };

  const onPause = () => {
    console.log('shohei - pause');
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null; // Ensure it's reset
    }
  };

  const onReset = () => {
    console.log('shohei - reset');
    onPause(); // Cleanup interval
    setHms(originalHms);
    updateTimerStatus('idle');
  };

  const onDone = () => {
    console.log('shohei - done');
    if (timerRef.current) clearInterval(timerRef.current); // Ensure no duplicate intervals

    const onSoundEnd = () => {
      const { hours, minutes, seconds } = originalHms;
      setHms({ hours, minutes, seconds });
      repeat ? updateTimerStatus('ongoing') : updateTimerStatus('done');
    };

    const kikeriki = async () => {
      // Play sound and wait for it to finish
      await roosterPlayer.play(onSoundEnd);
    };

    kikeriki();
  };

  useEffect(() => {
    console.log('shohei - timerStatus', timerStatus);

    switch (timerStatus) {
      case 'idle':
        onIdle();
        break;
      case 'ongoing':
        onPlay();
        break;
      case 'paused':
        onPause();
        break;
      case 'reset':
        onReset();
        break;
      case 'done':
        onDone();
        break;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current); // Cleanup when status changes
    };
  }, [timerStatus]);

  useEffect(() => {
    const ongoing = timerStatus === 'ongoing';
    // AUDITY: wut, this seems wrong lol
    if (!ongoing) return;

    const hrs = hms.hours ?? 0;
    const mins = hms.minutes ?? 0;
    const secs = hms.seconds ?? 0;

    // Time's up!
    const isTimeUp = ongoing && secs === 0 && mins === 0 && hrs === 0;
    if (isTimeUp) {
      return updateTimerStatus('done');
    }

    if (secs < 0) {
      // If `seconds` is below `0` and `minutes` is not `0`,
      // then refill `seconds` and decrement `minutes` by `1`.
      if (mins !== 0) {
        setHms(({ hours, minutes }) => ({
          hours,
          minutes: minutes !== null ? minutes - 1 : 0,
          seconds: 59,
        }));
        return;
      }

      // If `seconds` and `minutes` are both `0`, but `hours` is not,
      // then refill `minutes` and `seconds` and decrement `hours` by `1`.
      if (hrs !== 0) {
        setHms(({ hours }) => ({
          hours: hours !== null ? hours - 1 : 0,
          minutes: 59,
          seconds: 59,
        }));
        return;
      }
    }
  }, [hms]);

  const labelProps = {
    label,
    labelReadonly,
    onLabelUpdate: updateLabel,
    onReadonlyUpdate: updateLabelReadonly,
  } satisfies LabelProps;

  const controllerProps = {
    isTimerReady,
    isResettable: isTimerResettable,
    repeat,
    timerStatus,
    onClear: clearHms,
    onRepeat: repeatTimer,
    onUpdateTimerStatus: updateTimerStatus,
  } satisfies ControllerProps;

  const timerDisplayProps = {
    hms,
    originalHms,
    repeat,
    timerStatus,
    typing,
    setHms,
    setOriginalHms,
    onUpdateTimerStatus: updateTimerStatus,
    onUpdateTyping: updateTyping,
  } satisfies TimerBodyProps;

  return (
    <TimerCard
      timerStatus={timerStatus}
      onRemove={onRemove}
      headerChildren={<TimerHeader {...labelProps} />}
      bodyChildren={<TimerBody {...timerDisplayProps} />}
      footerChildren={<TimerFooter {...controllerProps} />}
    />
  );
}
