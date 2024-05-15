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
import RESTDatasource from "@/dataSources/RestDatasource";
import XmlaDatasource from "@/dataSources/XmlaDatasource";
import MQTTDatasource from "@/dataSources/MqttDatasource";
import { inject } from "vue";
import DataSource from "@/dataSources/DataSource";

declare interface DatasourceMap {
  [key: string]: IDatasource;
}
const dataSourceRegistry:Array<typeof DataSource> = [];
const availableDatasources: Ref<DatasourceMap> = ref({});

export function useDatasourceManager() {
  const EventBus = inject("customEventBus") as any;

  const initDatasource = (type: string, url: string, caption: string) => {
    const id = v4();

    for(let classinst of dataSourceRegistry){
      if(type == classinst.TYPE){
        const datasource = (new classinst(id, url, caption, EventBus) as IDatasource);
        availableDatasources.value[id] = datasource;
      }
    }
    console.log("Datasource should be inited");
    /*if (type === "REST") {
      const datasource = new RESTDatasource(id, url, caption);

      availableDatasources.value[id] = datasource;
    }
    if (type === "XMLA") {
      const datasource = new XmlaDatasource(id, undefined, caption);

      availableDatasources.value[id] = datasource;
    }
    if (type === "MQTT") {
      const datasource = new MQTTDatasource(id, url, caption, EventBus);

      availableDatasources.value[id] = datasource;
    }*/

    return id;
  };

  const getDatasource = (key) => {
    return availableDatasources.value[key];
  };

  const getDatasourceList = () => {
    return availableDatasources;
  };

  const updateDatasource = (key, type, caption, url) => {
    for(let classinst of dataSourceRegistry){
      if(type == classinst.TYPE){
        const datasource = (new classinst(key, url, caption, EventBus) as IDatasource);
        availableDatasources.value[key] = datasource;
      }
    }
  };

  const getState = () => {
    const state = {};

    // availableDatasources.value.forEach((ds) => {
    //   state[ds.id] = ds.getState();
    // });

    return JSON.stringify(state);
  };

  const loadState = (state) => {
    Object.keys(state).forEach((key) => {
      const ds = state[key];

      if (ds.type === "REST") {
        const datasource = new RESTDatasource(ds.id, ds.url, ds.caption);

        availableDatasources.value[key] = datasource;
      }
      if (ds.type === "XMLA") {
        const datasource = new XmlaDatasource(ds.id, ds.url, ds.caption);

        availableDatasources.value[key] = datasource;
      }
    });

    console.log(availableDatasources.value);
  };

  const registerDataSource = (class_ref)=>{
    dataSourceRegistry.push(class_ref);
  }
  const unRegisterDataSource = (class_ref:IDatasource)=>{
    //dataSourceRegistry.push(class_ref);
  }

  return {
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
