import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Timer } from './components';
import './App.css';
import { Timer as TimerType } from './types';
import { timersStore } from './store';

function App() {
  const [timers, setTimers] = useState<TimerType[]>([]);

  useEffect(() => {
    (async () => {
      const store = await timersStore.init();
      const timers = await store.getTimers();
      setTimers(timers);
    })();
  }, []);

  async function addTimer() {
    const timer = {
      id: uuidv4(),
      label: '',
      hms: { hours: 0, minutes: 0, seconds: 0 },
    };
    const updatedTimers = [...timers, timer];
    setTimers(updatedTimers);
    await timersStore.store?.set('timers', updatedTimers);
  }

  async function removeTimer(id: string) {
    const updatedTimers = timers.filter((timer) => timer.id !== id);
    setTimers(updatedTimers);
    await timersStore.store?.set('timers', updatedTimers);
  }

  return (
    <main>
      {timers.length > 0 &&
        timers.map((timer) => (
          <Timer
            key={timer.id}
            id={timer.id}
            onRemove={() => removeTimer(timer.id)}
          />
        ))}
      <div style={{ textAlign: 'center' }}>
        <button onClick={addTimer}>add a new timer</button>
      </div>
    </main>
  );
}

export default App;
