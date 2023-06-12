/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
import { XMLAApi } from "../api/xml";
import { defineStore } from "pinia";
import { usePivotTableStore } from "./PivotTable";
import { findIndex } from "lodash";
import { v4 } from "uuid";
import { useMetadataStorage } from "@/composables/metadataStorage";

export const useAppSettingsStore = defineStore("appSettingsStore", {
  state: () => ({
    xmlaApiInited: false,
    api: <XMLAApi | null>null,
    selectedCatalog: "",
    selectedCube: "",
    cubeOpened: false,
    loadingUids: [] as string[],
  }),
  actions: {
    async initXmlaApi(url: string) {
      const client = await this.$state.$soapClient;
      client.setEndpoint(url);
      this.api = new XMLAApi(client, url);
      this.xmlaApiInited = true;

      await this.api.startSession();
    },
    getApi(): XMLAApi {
      if (!this.api) {
        throw new Error("XMLA api is not inited");
      }
      return this.api as XMLAApi;
    },
    async openCube(catalogName: string, cube: string) {
      this.selectedCatalog = catalogName;
      this.selectedCube = cube;
      this.cubeOpened = true;
      const loadingId = this.setLoadingState();

      const metadataStorage = useMetadataStorage();
      await metadataStorage.initMetadataStorage(this.api, catalogName, cube);

      const pivotTableStore = usePivotTableStore();
      pivotTableStore.fetchPivotTableData();

      this.removeLoadingState(loadingId);
    },
    setLoadingState() {
      const uid = "id" + v4();
      this.loadingUids.push(uid);
      return uid;
    },
    removeLoadingState(loadingId) {
      const loadingIdIndex = findIndex(loadingId);
      if (loadingIdIndex >= 0) {
        this.loadingUids.splice(loadingIdIndex, 1);
      }
    },
  },
  getters: {
    loading(state) {
      return !!state.loadingUids.length;
    },
  },
});
