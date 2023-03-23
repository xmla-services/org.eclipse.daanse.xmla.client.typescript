import { XMLAApi } from "../api/xml";
import { defineStore } from "pinia";
import { useTreeViewDataStore } from "./TreeView";
import { usePivotTableStore } from "./PivotTable";
import { findIndex } from "lodash";

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

      const treeViewDataStore = useTreeViewDataStore();
      await treeViewDataStore.fetchCubeData(catalogName, cube);
      const pivotTableStore = usePivotTableStore();
      pivotTableStore.fetchPivotTableData();

      this.removeLoadingState(loadingId);
    },
    setLoadingState() {
      const uid = "id" + Math.random().toString(16).slice(2);
      this.loadingUids.push(uid);
      return uid;
    },
    removeLoadingState(loadingId) {
      const loadingIdIndex = findIndex(loadingId);
      if (loadingIdIndex >= 0) {
        this.loadingUids.splice(loadingIdIndex, 1);
      } 
    }
  },
  getters: {
    loading(state) {
      return !!state.loadingUids.length;
    }
  }
});
