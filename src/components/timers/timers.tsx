import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Hms, Timer as TimerType } from '../../types';
import { Timer } from '../timer/timer';
import { TimersStore } from '../../store';
import { Container } from './container';
import { AlarmClockPlusIcon } from 'lucide-react';

export function Timers() {
  const [timersStore, setTimersStore] = useState<TimersStore | undefined>(
    undefined
  );
  const [timers, setTimers] = useState<TimerType[]>([]);

  const addTimer = async () => {
    const timer = {
      id: uuidv4(),
      label: '',
      hms: { hours: 0, minutes: 0, seconds: 0 },
      originalHms: { hours: 0, minutes: 0, seconds: 0 },
      repeat: false,
    };
    const updatedTimers = [...timers, timer];
    await timersStore?.update(updatedTimers);
    setTimers(updatedTimers);
  };

  useEffect(() => {
    const loadTimers = async () => {
      const store = await TimersStore.init();
      const timers = await store.get();
      setTimersStore(store);
      setTimers(timers);
    };
    loadTimers();
  }, []);

  // TODO: maybe separate this logic into somewhere as i might have more keyboard shortcuts
  // Add a new timer on cmd+n
  useEffect(() => {
    const addTimerOnCmdN = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'n') {
        addTimer();
      }
    };
    document.addEventListener('keydown', addTimerOnCmdN);
    return () => document.removeEventListener('keydown', addTimerOnCmdN);
  }, [timers]);

  const removeTimer = async (id: string) => {
    const updatedTimers = timers.filter((timer) => timer.id !== id);
    await timersStore?.update(updatedTimers);
    setTimers(updatedTimers);
  };

  const updateTimer = async (
    id: string,
    label: string,
    repeat: boolean,
    hms: Hms,
    originalHms: Hms
  ) => {
    const updatedTimers = timers.map((timer) => {
      if (timer.id === id) {
        return {
          id,
          label,
          hms,
          originalHms,
          repeat,
        } satisfies TimerType;
      }
      return timer;
    });
    await timersStore?.update(updatedTimers); // Persist to storage
    setTimers(updatedTimers); // Update local state
  };

  return (
    <>
      <div className="w-10 h-10 mx-auto my-6">
        <button
          className="w-full h-full flex justify-center items-center rounded-full bg-zinc-800 text-white"
          onClick={addTimer}
        >
          <AlarmClockPlusIcon className="inline-block scale-95" />
        </button>
      </div>
      <Container>
        {timers.length > 0 &&
          timers.map((timer) => (
            <Timer
              key={timer.id}
              {...timer}
              onRemove={() => removeTimer(timer.id)}
              onUpdateTimer={updateTimer}
            />
          ))}
      </Container>
    </>
  );
}
