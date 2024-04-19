/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, watch } from "vue";
import { v4 } from "uuid";
import RESTDatasource from "@/dataSources/RestDatasource";
import XmlaDatasource from "@/dataSources/XmlaDatasource";
import MQTTDatasource from "@/dataSources/MqttDatasource";
import {inject} from "vue";




const availableDatasources = ref(
  new Map<string, RESTDatasource | XmlaDatasource | MQTTDatasource>(),
);

export function useDatasourceManager() {
  const EventBus = inject("customEventBus") as any;
  console.log(EventBus)

  const initDatasource = (type: string, url: string, caption: string) => {
    const id = v4();

    console.log("Datasource should be inited");
    if (type === "REST") {
      const datasource = new RESTDatasource(id, url, caption);

      availableDatasources.value.set(id, datasource);
    }
    if (type === "XMLA") {
      const datasource = new XmlaDatasource(id, undefined, caption);

      availableDatasources.value.set(id, datasource);
    }
    if (type === "MQTT") {

      const datasource = new MQTTDatasource(id, url, caption, EventBus);

      availableDatasources.value.set(id, datasource);
    }

    return id;
  };

  const getDatasource = (key) => {
    return availableDatasources.value.get(key);
  };

  const getDatasourceList = () => {
    return availableDatasources;
  };

  const updateDatasource = (key, type, caption, url) => {
    if (type === "REST") {
      const datasource = new RESTDatasource(key, url, caption);

      availableDatasources.value.set(key, datasource);
    }
    if (type === "XMLA") {
      const datasource = new XmlaDatasource(key, undefined, caption);

      availableDatasources.value.set(key, datasource);
    }
    if (type === "MQTT") {
      const datasource = new MQTTDatasource(key, url, caption,EventBus);

      availableDatasources.value.set(key, datasource);
    }
  };

  const getSerializedState = () => {
    const state = {};

    availableDatasources.value.forEach((ds) => {
      state[ds.id] = ds.getState();
    });

    return JSON.stringify(state);
  };

  const loadState = (state) => {

    Object.keys(state).forEach((key) => {
      const ds = state[key];

      if (ds.type === "REST") {
        const datasource = new RESTDatasource(ds.id, ds.url, ds.caption);

        availableDatasources.value.set(key, datasource);
      }
      if (ds.type === "XMLA") {
        const datasource = new XmlaDatasource(ds.id, ds.url, ds.caption);

        availableDatasources.value.set(key, datasource);
      }
    });

    console.log(availableDatasources.value);
  };

  return {
    initDatasource,
    getDatasource,
    getDatasourceList,
    updateDatasource,
    getSerializedState,
    loadState,
  };
}
