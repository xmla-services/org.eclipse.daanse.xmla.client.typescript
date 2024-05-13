/*
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

*/

import { ref, type Ref, inject } from "vue";
import type { TinyEmitter } from "tiny-emitter";

export function useStore<Type extends IStore>() {
  const data = ref({});
  const store = ref(null) as unknown as Ref<Type>;

  const EventBus = inject("customEventBus") as TinyEmitter;

  const updateFn = async () => {
    if (!store) return;
    data.value = await store.value.getData();
  };

  const setStore = (newStore: Type) => {
    if (store.value) {
      EventBus.off(`UPDATE:${store.value.id}`, updateFn);
    }

    if (!newStore) return;
    store.value = newStore;

    EventBus.on(`UPDATE:${newStore.id}`, updateFn);
    updateFn();
    console.log(store);
  };

  return {
    data,
    store,
    setStore,
  };
}
