import { updateStore } from "./store";
import { useStore } from "./useStore";

/**
 * Not exactly the way it should be done and it won't work as expected.
 * But, it illustrates how a custom global store can be created and used
 * with useSynchExternalStore.
 */
export const UI = () => {
  const state = useStore("ui");

  return (
    <div>
      <h1>UI Component</h1>
      <p>Current UI State: {JSON.stringify(state)}</p>
      <button
        onClick={() => {
          updateStore((prevState: any) => ({
            ...prevState,
            ui: { ...prevState.ui, updated: true }
          }));
        }}
      >
        Update UI State
      </button>
    </div>
  );
};
