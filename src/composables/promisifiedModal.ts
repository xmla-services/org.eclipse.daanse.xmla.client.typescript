/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref } from "vue";

export function usePromisifiedModal(
  resetFn: () => void,
  opened: (data: any) => void = () => {}
) {
  const isOpened = ref(false);
  let resolveFunction = (_val: any) => {};
  let runPromise: Promise<string> = new Promise((res) => {
    resolveFunction = res;
  });

  const run = (data: any) => {
    isOpened.value = true;
    opened(data);
    return runPromise;
  };

  const close = (data: any) => {
    resolveFunction(data);
    runPromise = new Promise<string>((res) => {
      resolveFunction = res;
    });

    isOpened.value = false;
    resetFn();
  };

  return { isOpened, run, close };
}
