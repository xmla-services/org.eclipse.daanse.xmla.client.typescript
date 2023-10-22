import { useDatasourceManager } from "@/composables/datasourceManager";

export class Store {
  public caption = "";
  public id = "";
  private datasourceIds = [] as string[];
  private datasourceManager: any;

  public data = null;

  constructor(id, caption) {
    this.id = id;
    this.caption = caption;
    this.datasourceManager = useDatasourceManager();
  }

  addDatasource(datasourceId) {
    this.datasourceIds.push(datasourceId);
  }

  async getData(url) {
    const datasource = this.datasourceManager.getStore(this.datasourceIds[0]);
    const json = await datasource?.getData(url);

    this.data = json;
    return json;
  }
}
