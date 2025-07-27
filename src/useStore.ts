import { store, updateStore } from "./store";
import { useSyncExternalStore } from "react";

export const useStore = (key: string | undefined) => {
  const getter = () => {
    if (key == undefined) {
      return store.state;
    }

    const state = store.state;
    if (typeof state === "object" && state !== null && key in state) {
      // @ts-expect-error
      return state[key];
    }

    return state;
  };

  return [useSyncExternalStore(store.subscribe, () => getter()), updateStore];
};
