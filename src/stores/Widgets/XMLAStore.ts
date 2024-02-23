import { useDatasourceManager } from "@/composables/datasourceManager";

interface EventBus {
  emit: (string, any?) => void;
  on: (string, Function) => void;
  off: (string, Function) => void;
}

export class XMLAStore {
  public caption = "";
  public id = "";
  public datasourceIds = [] as string[];
  private datasourceManager: any;
  public data = null;
  private eventBus = null as unknown as EventBus;
  public events = [] as Array<{ name: string; action: string }>;
  public initedEvents = [] as Array<{ name: string; cb: Function }>;
  public type = "XMLA";

  public row = null;
  public column = null;
  public measure = null;

  constructor(id, caption, eventBus: EventBus) {
    this.id = id;
    this.caption = caption;
    this.datasourceManager = useDatasourceManager();
    this.eventBus = eventBus;
  }

  addDatasource(datasourceId) {
    this.datasourceIds.push(datasourceId);
  }

  setDatasources(datasourceIds) {
    this.datasourceIds = [...datasourceIds];
    this.eventBus.emit(`UPDATE:${this.id}`);
  }

  async getData(body) {
    const datasource = this.datasourceManager.getDatasource(
      this.datasourceIds[0],
    );

    const responce = await datasource.getData(body);
    return responce;
  }

  setOptions({ caption, column, row, measure }) {
    this.caption = caption || this.caption;
    this.row = row || this.row;
    this.column = column || this.column;
    this.measure = measure || this.measure;

    console.log("EMITED UPDATE", this.id);
    this.eventBus.emit(`UPDATE:${this.id}`);
  }

  getDatasource() {
    return this.datasourceManager.getDatasource(this.datasourceIds[0]);
  }

  getState() {
    return {
      caption: this.caption,
      id: this.id,
      events: this.events,
      datasourceIds: this.datasourceIds,
    };
  }

  loadState(state) {
    this.caption = state.caption;
    this.id = state.id;
    this.events = state.events;
    this.datasourceIds = state.datasourceIds;
  }
}
