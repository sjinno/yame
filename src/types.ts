export type EmptyString = '';
export type Pause = 'paused' | 'unpaused' | null;
export type TimerStatus = 'idle' | 'playing' | 'paused' | 'stopped' | 'done';

export type Hms = {
  hours: number | null;
  minutes: number | null;
  seconds: number | null;
};

// TODO: consider using zod
export type Timer = {
  id: string;
  label: string;
  repeat: boolean;
  hms: Hms;
  originalHms: Hms;
};
