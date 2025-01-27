import { Store } from '@tauri-apps/plugin-store';
import { v4 as uuid4 } from 'uuid';
import { Timer } from '../types';

export class TimersStore {
  private static instance?: TimersStore;
  private store!: Store;

  private constructor() {}

  static async init(): Promise<TimersStore> {
    if (!TimersStore.instance) {
      const instance = new TimersStore();
      await instance.initializeStore();
      TimersStore.instance = instance;
    }
    return TimersStore.instance;
  }

  private async initializeStore() {
    try {
      this.store = await Store.load('store.json');
      const timers = await this.store.get('timers');

      if (!timers) {
        await this.store.set('timers', [
          {
            id: uuid4(),
            label: '',
            hms: { hours: 0, minutes: 0, seconds: 0 },
            originalHms: { hours: 0, minutes: 0, seconds: 0 },
            repeat: false,
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to initialize the TimersStore:', error);
      throw error;
    }
  }

  async get(): Promise<Timer[]> {
    if (!this.store) {
      throw new Error(
        'TimersStore has not been initialized. Call TimersStore.init().'
      );
    }

    try {
      return (await this.store.get('timers'))!;
    } catch (error) {
      console.error('Failed to fetch timers:', error);
      throw error;
    }
  }

  async update(timers: Timer[]) {
    try {
      await this.store.set('timers', timers);
    } catch (error) {
      console.error('Failed to update timers:', error);
      throw error;
    }
  }
}
