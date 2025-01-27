import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Hms, Timer as TimerType } from '../../types';
import { Timer } from '../timer/timer';
import { TimersStore } from '../../store';
import { Container } from './container';

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
      <div className="text-center">
        <button
          className="border-1 border-solid border-black p-1.5"
          onClick={addTimer}
        >
          add a new timer
        </button>
      </div>
    </>
  );
}
