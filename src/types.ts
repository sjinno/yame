export type Hms = {
  hours: number;
  minutes: number;
  seconds: number;
};

export type Timer = {
  id: string;
  label: string;
  hms: Hms;
};

export type Pause = 'paused' | 'unpaused' | null;

export type EmptyString = '';
export type HmsKind = 'Hours' | 'Minutes' | 'Seconds';
