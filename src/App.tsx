import './App.css';
import { Footer } from './components';
import { Timers } from './components/timers';

function App() {
  return (
    <div className="app-container">
      <main>
        <Timers />
      </main>
      <Footer />
    </div>
  );
}

export default App;
