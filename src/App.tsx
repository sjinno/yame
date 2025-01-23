import { useEffect, useState } from 'react';
import { Timer } from './components';
import './App.css';
import { store } from './store';

function App() {
  const [timers, setTimers] = useState([1]);

  useEffect(() => {
    (async () => {
      const world = await store?.get('hello');
      console.log('hello', world);
    })();
  }, []);

  function handleAddTimer() {
    const id = timers.length + 1;
    setTimers((prev) => [...prev, id]);
  }

  return (
    <main>
      {timers.length > 0 && timers.map((timer) => <Timer key={timer} />)}
      <button onClick={handleAddTimer}>add a new timer</button>
    </main>
  );
}

export default App;
