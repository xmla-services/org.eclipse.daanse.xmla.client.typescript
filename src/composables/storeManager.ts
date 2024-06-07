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
import type BaseStore from "@/stores/Widgets/BaseStore";

const availableStores = ref(new Map<string, IStore & ISerializable>());
const storeRegistry:Map<string,typeof BaseStore> = new Map();

export interface StoreManagerI{
  initStore:Function,
  getStore:Function,
  getState:Function,
  getStoreList:Function,
  loadState:Function,
  registerStoreType:Function
}

export function useStoreManager():StoreManagerI {
  const initStore = (
    caption = "NO CAPTION",
    eventBus,
    type = "REST",
  ): string => {
    console.log(eventBus);
    const id = v4();

    let storeClass = storeRegistry[type];
    const store = reactive(new storeClass(id, caption, eventBus) as IStore & ISerializable);
    availableStores.value.set(id, store);

    console.log("inited");

    return id;
  };

  const getStore = (key): IStore => {
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

      let storeClass = storeRegistry[state[key].type];
      const store:(IStore & ISerializable) = reactive(new storeClass(key, state[key].caption, eventBus)) ;
      store.loadState(state[key]);
      availableStores.value.set(key, store);
    });
    console.log(availableStores.value);
  };

  const registerStoreType = (classOfStoreType:typeof Store)=>{
    storeRegistry[classOfStoreType.TYPE]= classOfStoreType;
  }

  return {
    registerStoreType,
    initStore,
    getStore,
    getStoreList,
    getState,
    loadState,
  };
}
