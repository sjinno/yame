import { Store } from '@tauri-apps/plugin-store';
import { v4 as uuid4 } from 'uuid';
import { Timer } from '../types';

class TimersStore {
  store?: Store;

  constructor() {}

  async init(): Promise<TimersStore> {
    this.store = await Store.load('store.json');
    const timers = await this.store.get('timers');

    if (!timers) {
      this.store.set('timers', [
        {
          id: uuid4(),
          label: '',
          hms: { hours: 0, minutes: 0, seconds: 0 },
          originalHms: '0:0:0',
          repeat: false,
        } satisfies Timer,
      ]);
    }

    return this;
  }

  async getTimers(): Promise<Timer[]> {
    if (!this.store) await this.init();
    return (await this.store!.get('timers'))!;
  }
}

export const timersStore = new TimersStore();
