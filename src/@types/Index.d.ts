/*
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena
*/

declare interface ISerializable {
    getState: () => any;
    loadState: (state: any, eventBus?: any) => void;
}

declare interface IDatasource extends ISerializable {
    id: string;
    caption: string;
    url: string;
    type: "REST" | "XMLA" | "CSV" | "JSON" | "MQTT";
    getData: (params: any) => Promise<any>;
}

interface IStore {
    id: string;
    caption: string;
    events: IStoreEvents[];
    type: "REST" | "XMLA";
    datasourceId: string | null;
    setDatasource: (datasourceId: string) => void;
    getDatasource: () => IDatasource;
    getData: (params?: any) => Promise<any>;
    setOptions: (options: IStoreParams) => void;
    updateParam: (paramName: string, value: string) => void;
    updateEvents: (events: IStoreEvents[]) => void;
}

interface EventBus {
    emit: (string, any?) => void;
    on: (string, Function) => void;
    off: (string, Function) => void;
}

interface IStoreParams {
    [key: string]: any;
}

interface IStoreEvents {
    name: string;
    action: string;
}
