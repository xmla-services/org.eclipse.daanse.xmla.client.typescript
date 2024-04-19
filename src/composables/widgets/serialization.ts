import type { Ref } from "vue";

export function useSerialization<Type>(settings: Ref<Type>) {
  const getState = () => {
    const state = {} as Type;
    const componentState = settings.value;

    for (const key in componentState) {
      state[key] = componentState[key];
    }

    return state;
  };

  return {
    getState,
  };
}
