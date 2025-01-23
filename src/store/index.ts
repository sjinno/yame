import { Store } from '@tauri-apps/plugin-store';

export let store: Store | null = null;

async function initStore(): Promise<Store> {
  return await Store.load('store.json');
}

(async () => {
  try {
    store = await initStore();
    store.set('hello', 'world');
  } catch (error) {
    console.error(error);
  }
})();
