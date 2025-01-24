export type Hms = {
  hours: number | null;
  minutes: number | null;
  seconds: number | null;
};

export type Timer = {
  id: string;
  label: string;
  hms: Hms;
  originalHms: string;
  repeat: boolean;
};

export type Pause = 'paused' | 'unpaused' | null;

export type EmptyString = '';
export type HmsKind = 'hours' | 'minutes' | 'seconds';
