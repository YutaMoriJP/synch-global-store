export const builderStore = {
  stores: new Map(),
  create(nodeId: string) {
    const store = this.stores.get(nodeId);
    if (!store) {
      const newStore = new Store();
      this.stores.set(nodeId, newStore);
    }

    return true;
  },

  delete(nodeId: string) {
    if (this.stores.has(nodeId)) {
      this.stores.delete(nodeId);
    }
  },

  get(nodeId: string): Store {
    return this.stores.get(nodeId);
  }
};

const STORE_ID = crypto.randomUUID();
const create = () => {
  if (!builderStore.stores.has(STORE_ID)) {
    builderStore.create(STORE_ID);
  }

  return builderStore.get(STORE_ID);
};

export const store = create();
export const updateStore = (state: unknown | ((prevState: unknown) => unknown)) => {
  return store.setState(state);
};

class Subscribable {
  protected listeners = new Set<() => unknown>();

  constructor() {
    this.subscribe = this.subscribe.bind(this);
  }

  subscribe(listener: () => unknown): () => void {
    this.listeners.add(listener);
    this.onSubscribe();

    return () => {
      this.listeners.delete(listener);
      this.onUnsubscribe();
    };
  }

  hasListeners(): boolean {
    return this.listeners.size > 0;
  }

  protected onSubscribe(): void {
    // Do nothing
  }

  protected onUnsubscribe(): void {
    // Do nothing
  }

  notify(...args: unknown[]): void {
    for (const listener of this.listeners) {
      (listener as unknown as (...args: unknown[]) => void)(...args);
    }
  }
}

export class Store extends Subscribable {
  state: unknown = undefined;

  constructor() {
    super();
  }

  get() {
    return this.state;
  }

  setState(state: unknown | ((prevState: unknown) => unknown)) {
    let newState: unknown;
    if (typeof state === "function") {
      newState = state(this.state);
    } else {
      newState = state;
    }
    // @ts-expect-error
    this.state = { ...this.state, ...newState };
    this.onStateChange(this.state);
  }

  onStateChange(data: unknown) {
    this.notify(data);
  }

  protected onSubscribe() {}

  protected onUnsubscribe() {}
}
