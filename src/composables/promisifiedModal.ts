/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref } from "vue";

export function usePromisifiedModal(
  resetFn: () => void,
  opened: () => void = () => {}
) {
  const isOpened = ref(false);
  let resolveFunction = (_val: any) => {};
  const runPromise: Promise<string> = new Promise((res) => {
    resolveFunction = res;
  });

  const run = () => {
    isOpened.value = true;
    opened();
    return runPromise;
  };

  const close = (data: any) => {
    resolveFunction(data);
    isOpened.value = false;
    resetFn();
  };

  return { isOpened, run, close };
}
