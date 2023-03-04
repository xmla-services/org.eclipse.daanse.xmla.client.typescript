import { XMLAApi } from "../api/xml";
import { defineStore } from "pinia";
import { useTreeViewDataStore } from "./TreeView";
import { usePivotTableStore } from "./PivotTable";

export const useAppSettingsStore = defineStore("appSettingsStore", {
  state: () => {
    return {
      xmlaApiInited: false,
      api: <XMLAApi | null>null,
      selectedCatalog: "",
      selectedCube: "",
      cubeOpened: false,
    };
  },
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

      const treeViewDataStore = useTreeViewDataStore();
      await treeViewDataStore.fetchCubeData(catalogName, cube);
      const pivotTableStore = usePivotTableStore();
      pivotTableStore.fetchPivotTableData();
    },
  },
});
