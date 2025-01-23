import { useState } from 'react';
import './App.css';
import { Timer } from './components';

function App() {
  const [timers, setTimers] = useState([1]);

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
