import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Timer } from './components';
import { Hms, Timer as TimerType } from './types';
import { timersStore } from './store';

import './App.css';

function App() {
  const [timers, setTimers] = useState<TimerType[]>([]);

  useEffect(() => {
    const loadTimers = async () => {
      const store = await timersStore.init();
      const timers = await store.getTimers();
      setTimers(timers);
    };

    loadTimers();
  }, []);

  async function addTimer() {
    const timer = {
      id: uuidv4(),
      label: '',
      hms: { hours: 0, minutes: 0, seconds: 0 },
      originalHms: { hours: 0, minutes: 0, seconds: 0 },
      repeat: false,
    };
    const updatedTimers = [...timers, timer];
    await timersStore.store?.set('timers', updatedTimers);
    setTimers(updatedTimers);
  }

  async function removeTimer(id: string) {
    const updatedTimers = timers.filter((timer) => timer.id !== id);
    await timersStore.store?.set('timers', updatedTimers);
    setTimers(updatedTimers);
  }

  async function updateTimer(
    id: string,
    label: string,
    hms: Hms,
    originalHms: Hms,
    repeat: boolean
  ) {
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
    await timersStore.store?.set('timers', updatedTimers); // Persist to storage
    setTimers(updatedTimers); // Update local state
  }

  return (
    <main>
      {timers.length > 0 &&
        timers.map((timer) => (
          <Timer
            key={timer.id}
            {...timer}
            onRemove={() => removeTimer(timer.id)}
            onUpdateTimer={updateTimer}
          />
        ))}
      <div style={{ textAlign: 'center' }}>
        <button onClick={addTimer}>add a new timer</button>
      </div>
    </main>
  );
}

export default App;
