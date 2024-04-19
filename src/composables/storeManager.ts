/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

/* eslint-disable @typescript-eslint/no-unused-vars */
import { reactive, ref, watch } from "vue";
import queryString from "query-string";
import { optionalArrayToArray } from "@/utils/helpers";
import { v4, v5 } from "uuid";
import { Store } from "@/stores/Widgets/Store";
import { XMLAStore } from "@/stores/Widgets/XMLAStore";

const availableStores = ref(new Map<string, any>());

export function useStoreManager() {
  const initStore = (
    caption = "NO CAPTION",
    eventBus,
    type = "REST",
  ): string => {
    console.log(eventBus);
    const id = v4();

    if (type === "REST") {
      const store = reactive(new Store(id, caption, eventBus));
      availableStores.value.set(id, store);
    } else {
      const store = reactive(new XMLAStore(id, caption, eventBus));
      availableStores.value.set(id, store);
    }
    console.log("inited");

    return id;
  };

  const getStore = (key): Store | XMLAStore => {
    const store = availableStores.value.get(key);
    if (store) {
      return store;
    } else {
      throw new Error("Store with provided id doesn't exist");
    }
  };

  const getStoreList = () => {
    return availableStores;
  };

  const getState = () => {
    const state = {};

    availableStores.value.forEach((store) => {
      state[store.id] = store.getState();
    });

    return JSON.stringify(state);
  };

  const loadState = (state, eventBus) => {
    availableStores.value.clear();

    Object.keys(state).forEach((key) => {
      const store = new Store(key, state[key].caption, eventBus);
      store.loadState(state[key]);
      availableStores.value.set(key, store);
    });
    console.log(availableStores.value);
  };

  return {
    initStore,
    getStore,
    getStoreList,
    getState,
    loadState,
  };
}
