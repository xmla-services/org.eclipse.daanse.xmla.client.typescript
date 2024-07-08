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

declare interface DatasourceMap {
    [key: string]: IDatasource;
}

const availableDatasources: Ref<DatasourceMap> = ref({});

export function useDatasourceManager() {
    const EventBus = inject("customEventBus") as any;

    const initDatasource = (type: string, url: string, caption: string) => {
        const id = v4();

        console.log("Datasource should be inited");
        if (type === "REST") {
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
        }

        return id;
    };

    const getDatasource = (key) => {
        return availableDatasources.value[key];
    };

    const getDatasourceList = () => {
        return availableDatasources;
    };

    const updateDatasource = (key, type, caption, url) => {
        console.log("Datasource should be updated", key, type, caption, url);
        if (type === "REST") {
            const datasource = new RESTDatasource(key, url, caption);

            availableDatasources.value[key] = datasource;
        }
        if (type === "XMLA") {
            const datasource = new XmlaDatasource(key, url, caption);

            availableDatasources.value[key] = datasource;
        }
        if (type === "MQTT") {
            const datasource = new MQTTDatasource(key, url, caption, EventBus);

            availableDatasources.value[key] = datasource;
        }
    };

    const getState = () => {
        const state = {};

        Object.keys(availableDatasources.value).forEach((key) => {
            const ds = availableDatasources.value[key];
            state[ds.id] = ds.getState();
        });

        return JSON.stringify(state);
    };

    const loadState = (state) => {
        const parsed = JSON.parse(state);

        Object.keys(parsed).forEach((key) => {
            const ds = parsed[key];

            if (ds.type === "REST") {
                const datasource = new RESTDatasource(
                    ds.id,
                    ds.url,
                    ds.caption,
                );

                availableDatasources.value[key] = datasource;
            }
            if (ds.type === "XMLA") {
                const datasource = new XmlaDatasource(
                    ds.id,
                    ds.url,
                    ds.caption,
                );

                availableDatasources.value[key] = datasource;
            }
        });

        console.log(availableDatasources.value);
    };

    return {
        initDatasource,
        getDatasource,
        getDatasourceList,
        updateDatasource,
        getState,
        loadState,
    };
}
