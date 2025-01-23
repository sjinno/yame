import { Pause } from '../../types';

interface Props {
  isTimerReady: boolean;
  play: boolean;
  pause: Pause;
  repeat: boolean;
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  setPause: React.Dispatch<React.SetStateAction<Pause>>;
  setRepeat: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Controller({
  isTimerReady,
  play,
  pause,
  repeat,
  setPlay,
  setPause,
  setRepeat,
}: Props) {
  const playTimer = () => {
    if (!isTimerReady) return;

    setPlay(true);
    setPause('unpaused');
  };

  const pauseTimer = () => {
    setPlay(false);
    setPause('paused');
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        paddingBlock: '5px',
      }}
    >
      <button disabled={!isTimerReady || play} onClick={playTimer}>
        start
      </button>
      <button
        disabled={pause === 'paused' || pause === null}
        onClick={pauseTimer}
      >
        pause
      </button>
      <button
        disabled={!play && pause !== 'paused'}
        onClick={() => {
          setPlay(false);
          setPause(null);
        }}
      >
        stop & reset
      </button>
      <div
        style={{
          display: 'flex',
          gap: '5px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <input
          type="checkbox"
          name="repeat"
          id="repeat"
          checked={repeat}
          onChange={() => setRepeat((prev) => !prev)}
        />
        <label htmlFor="repeat">repeat</label>
      </div>
    </div>
  );
}
