import { XMLAApi } from "@/api/xml";
import { createClientAsync } from "@/XMLAClient";
// import { usePivotTableStore } from "./PivotTable";
// import { findIndex } from "lodash";
// import { v4 } from "uuid";
import { useMetadataStorage } from "@/composables/metadataStorage";
// import { createClientAsync, type XmlaClient } from ;

export default class XMLADatasource {
  public url = "";
  public id = null as unknown as string;
  public caption = null;
  public type = "XMLA";
  public client: any;

  private api = <XMLAApi | null>null;
  private tmpMDX = `SELECT
  Hierarchize(AddCalculatedMembers({[Geschlecht.Geschlecht (m/w/d)].[(All)].members})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME ON 1,
  Hierarchize(AddCalculatedMembers({[Jahr].[Jahr].members})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME ON 0
  FROM [Bevölkerung] CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS`;

  constructor(
    id,
    url = "https://emondrian.ssemenkoff.dev/emondrian/xmla",
    caption,
  ) {
    this.id = id;
    this.url = url;
    this.caption = caption;
    const initApi = async () => {
      this.client = await createClientAsync("def/xmla.wsdl");

      this.client.setEndpoint(url);
      console.log(url);
      this.api = new XMLAApi(this.client, url);
      await this.api.startSession();
    };

    initApi();
  }

  async getData(mdx = this.tmpMDX) {
    console.log(mdx);
    const mdxResponce = await this.api?.getMDX(mdx);
    return mdxResponce;
  }

  getApi() {
    return this.api;
  }

  async openCube(catalogName: string, cube: string) {
    const metadataStorage = useMetadataStorage();
    await metadataStorage.initMetadataStorage(this.api, catalogName, cube);

    // const pivotTableStore = usePivotTableStore();
    // pivotTableStore.fetchPivotTableData();

    // this.removeLoadingState(loadingId);
  }

  // setLoadingState() {
  //   const uid = "id" + v4();
  //   this.loadingUids.push(uid);
  //   return uid;
  // }

  // removeLoadingState(loadingId) {
  //   const loadingIdIndex = findIndex(loadingId);
  //   if (loadingIdIndex >= 0) {
  //     this.loadingUids.splice(loadingIdIndex, 1);
  //   }
  // }

  // switchViewOption(option:ViewOptions){
  //   this.viewOption = option;
  // }

  // switchOptional(selection:OptionalSelects){
  //   this.optionalSelect = selection;
  // }

  getState() {
    return {
      id: this.id,
      url: this.url,
      caption: this.caption,
      type: this.type,
    };
  }
}
