import { XMLAApi } from "@/api/xml";
import { createClientAsync } from "@/XMLAClient";
import { MetadataStore } from "./Storage/MetadataStore";

export default class XMLADatasource {
  public url = "";
  public id = null as unknown as string;
  public caption = null;
  public type = "XMLA";
  public client: any;
  public cube: any | null = null;
  public catalog: any | null = null;
  public metadataStore: MetadataStore | null = null;

  private api = <XMLAApi | null>null;

  constructor(
    id,
    url = "https://emondrian.ssemenkoff.dev/emondrian/xmla",
    caption,
  ) {
    this.id = id;
    this.url = url;
    this.caption = caption;
    this.cube = null;

    const initApi = async () => {
      this.client = await createClientAsync("def/xmla.wsdl");

      this.client.setEndpoint(url);
      console.log(url);
      this.api = new XMLAApi(this.client, url);
      await this.api.startSession();
    };

    initApi();
  }

  async getData(mdx) {
    console.log(mdx);
    const mdxResponce = await this.api?.getMDX(mdx);
    return mdxResponce;
  }

  getApi() {
    return this.api;
  }

  async openCube(catalogName: string, cube: string) {
    if (!this.api) throw new Error("API is not initialized");

    const metadataStore = new MetadataStore(this.api);
    await metadataStore.loadMetadata(catalogName, cube);
    this.metadataStore = metadataStore;
  }

  async getHierarchies() {
    return this.metadataStore?.getHierarchies();
  }

  async getMeasures() {
    return this.metadataStore?.getMeasures();
  }

  public async getCatalogs() {
    if (!this.api) throw new Error("API is not initialized");

    return await this.api.getCatalogs();
  }

  public async getCubes(catalogName: string) {
    if (!this.api) throw new Error("API is not initialized");

    return await this.api.getCubes(catalogName);
  }

  public async setCube(cube) {
    this.cube = cube;
  }

  public async setCatalog(catalog) {
    this.catalog = catalog;
  }

  public getProperties() {
    return this.metadataStore?.getProperties();
  }

  public getLevels() {
    return this.metadataStore?.getLevels();
  }

  public async getMember(parentLevel, parentName) {
    if (!this.api) throw new Error("API is not initialized");

    return await this.api?.getMember(parentLevel, parentName);
  }

  getState() {
    return {
      id: this.id,
      url: this.url,
      caption: this.caption,
      type: this.type,
    };
  }
}
