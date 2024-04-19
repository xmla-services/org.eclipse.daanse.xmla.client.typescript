/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

import { useDatasourceManager } from "@/composables/datasourceManager";

interface EventBus {
  emit: (string, any?) => void;
  on: (string, Function) => void;
  off: (string, Function) => void;
}

export class Store {
  public caption = "";
  public id = "";
  public datasourceIds = [] as string[];
  private datasourceManager: any;
  public data = null;
  private eventBus = null as unknown as EventBus;
  public params = {} as any;
  public requestTemplate = "";
  public events = [] as Array<{ name: string; action: string }>;
  public initedEvents = [] as Array<{ name: string; cb: Function }>;
  private runtimeParams = {} as any;

  constructor(id, caption, eventBus: EventBus) {
    this.id = id;
    this.caption = caption;
    this.datasourceManager = useDatasourceManager();
    this.eventBus = eventBus;
    this.requestTemplate = "/products/{pageNum}";
    // this.params = {
    //   pageNum: 1,
    // };

    this.calculateParams();
    this.registerForDataSourceEvents();
  }

  calculateParams() {
    const cachedParams = { ...this.params };
    this.params = {};

    const params = this.requestTemplate.match(/[^{}]+(?=})/g) || [];
    params.forEach((name) => {
      this.params[name] = cachedParams[name] || null;
    });

    this.runtimeParams = { ...this.params };
    console.log(this.params);
  }

  updateParam(paramName, value) {
    this.params[paramName] = value;
    this.runtimeParams[paramName] = value;
    this.eventBus.emit(`UPDATE:${this.id}`);
  }

  addDatasource(datasourceId) {
    this.datasourceIds.push(datasourceId);
  }

  setDatasources(datasourceIds) {
    this.datasourceIds = [...datasourceIds];
    this.eventBus.emit(`UPDATE:${this.id}`);
    this.registerForDataSourceEvents();
  }

  async getData() {
    let requestTemplate = this.requestTemplate;

    const datasource = this.datasourceManager.getDatasource(
      this.datasourceIds[0],
    );

    const paramsList = Object.keys(this.params);
    paramsList.forEach((e) => {
      console.log(e);
      requestTemplate = requestTemplate.replace(
        `{${e}}`,
        this.runtimeParams[e],
      );
    });

    const json = await datasource?.getData(requestTemplate);

    this.data = json;
    return json;
  }

  setOptions({ caption = "", requestTemplate = "" }) {
    this.caption = caption;
    this.requestTemplate = requestTemplate;

    this.calculateParams();
    console.log("EMITED UPDATE", this.id);
    this.eventBus.emit(`UPDATE:${this.id}`);
  }

  updateEvents(events) {
    console.log(events);
    this.initedEvents.forEach((e) => {
      this.eventBus.off(e.name, e.cb);
    });

    this.initedEvents = [];
    this.events = events;

    events.forEach((e: { name: string; action: string }) => {
      const cb = (value) => {
        const functionArgs = Object.keys(this.runtimeParams);
        const functionArgsVals = Object.values(this.runtimeParams);

        // TODO: replace with webworker
        const userEvent = Function(
          ...functionArgs,
          "$value",
          `
            console.log(arguments)
            ${e.action};
            return arguments;
          `,
        );

        const modifiedParams = userEvent(...functionArgsVals, value);
        functionArgs.forEach((e, i) => {
          this.runtimeParams[e] = modifiedParams[i];
        });

        this.eventBus.emit(`UPDATE:${this.id}`);
      };

      this.eventBus.on(e.name, cb);
      this.initedEvents.push({
        name: e.name,
        cb,
      });
    });
  }

  registerForDataSourceEvents(){
    for(let id of this.datasourceIds){
      this.eventBus.on(`UPDATE:${id}`,()=>{
        console.log('updt');
        this.eventBus.emit(`UPDATE:${this.id}`);
      });
    }
  }

  getState() {
    return {
      caption: this.caption,
      id: this.id,
      requestTemplate: this.requestTemplate,
      events: this.events,
      datasourceIds: this.datasourceIds,
      params: this.params,
    };
  }

  loadState(state) {
    this.caption = state.caption;
    this.id = state.id;
    this.requestTemplate = state.requestTemplate;
    this.events = state.events;
    this.datasourceIds = state.datasourceIds;
    this.params = state.params;
    this.calculateParams();
    this.updateEvents(this.events);
  }
}
