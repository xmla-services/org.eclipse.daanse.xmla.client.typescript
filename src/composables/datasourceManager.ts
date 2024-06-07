/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Ref, ref, watch } from "vue";
import { v4 } from "uuid";
import { inject } from "vue";
import DataSource from "@/dataSources/DataSource";

declare interface DatasourceMap {
  [key: string]: IDatasource;
}
declare interface DatasourceRegistryMap {
  [key: string]:  typeof DataSource;
}
const dataSourceRegistry:DatasourceRegistryMap = {};
const availableDatasources: Ref<DatasourceMap> = ref({});

export function useDatasourceManager() {
  const EventBus = inject("customEventBus") as any;

  const initDatasource = (type: string, url: string, caption: string) => {
    const id = v4();

    try{
      const classinst = dataSourceRegistry[type];
      const datasource = (new classinst(id, url, caption, EventBus) as IDatasource);
      availableDatasources.value[id] = datasource;
      return id;
    }catch (e){
        throw new TypeError(`${type} not found in registry`)
    }

  };

  const getDatasource = (key) => {
    return availableDatasources.value[key];
  };

  const getDatasourceList = () => {
    return availableDatasources;
  };

  const updateDatasource = (key, type, caption, url) => {
    try{
      const classinst = dataSourceRegistry[type];
      const datasource = (new classinst(key, url, caption, EventBus) as IDatasource);
      availableDatasources.value[key] = datasource;
    }catch (e){
      throw new TypeError(`${type} not found in registry`)
    }
  };

  const getState = () => {
    const state = {};
    return JSON.stringify(state);
  };

  const loadState = (state) => {
    Object.keys(state).forEach((key) => {
      const ds = state[key];

      try{
        const classinst = dataSourceRegistry[ds.type];
        const datasource = (new classinst(key, ds.url, ds.caption, EventBus) as IDatasource);
        availableDatasources.value[key] = datasource;
      }catch (e){
        throw new TypeError(`${ds.type} not found in registry`)
      }

    });
    console.log(availableDatasources.value);
  };

  const registerDataSource = (class_ref:typeof DataSource)=>{
    dataSourceRegistry[class_ref.TYPE]=class_ref;
  }
  const unRegisterDataSource = (class_ref: typeof DataSource)=>{
    delete dataSourceRegistry[class_ref.TYPE];
    //dataSourceRegistry.push(class_ref);
  }
  const getDataSourceRegistry = ()=>{
    return dataSourceRegistry
  }

  return {
    getDataSourceRegistry,
    registerDataSource,
    unRegisterDataSource,
    initDatasource,
    getDatasource,
    getDatasourceList,
    updateDatasource,
    getState,
    loadState,
  };
}
