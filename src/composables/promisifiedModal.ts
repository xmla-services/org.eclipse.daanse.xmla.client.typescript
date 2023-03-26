/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

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
