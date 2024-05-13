/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
import { XMLAApi } from "@/api/xml";
import { createClientAsync } from "@/XMLAClient";
import { MetadataStore } from "./Storage/MetadataStore";

export default class XMLADatasource implements IDatasource, ISerializable {
  public url: string;
  public id: string;
  public caption: string;
  public type = "XMLA" as const;

  public cube: MDSchemaCube | null = null;
  public catalog: DBSchemaCatalog | null = null;
  private metadataStore: MetadataStore | null = null;

  private api: Promise<XMLAApi>;

  constructor(
    id: string,
    url: string = "https://emondrian.ssemenkoff.dev/emondrian/xmla",
    caption: string,
  ) {
    this.id = id;
    this.url = url;
    this.caption = caption;

    this.api = new Promise((res) => {
      const initApi = async () => {
        const client = await createClientAsync("def/xmla.wsdl");

        client.setEndpoint(url);
        const api = new XMLAApi(client, url);
        await api.startSession();

        res(api);
      };

      initApi();
    });
  }

  async getData(mdx: string) {
    const api = await this.api;
    const mdxResponce = await api.getMDX(mdx);
    return mdxResponce;
  }

  getApi(): Promise<XMLAApi> {
    return this.api;
  }

  async openCube(catalogName: string, cube: string) {
    const api = await this.api;

    const metadataStore = new MetadataStore(api);
    await metadataStore.loadMetadata(catalogName, cube);
    this.metadataStore = metadataStore;
  }

  async getHierarchies(): Promise<MDSchemaHierarchy[]> {
    if (!this.metadataStore) throw new Error("Metadata store is not loaded");

    return this.metadataStore.getHierarchies();
  }

  async getMeasures(): Promise<MDSchemaMeasure[]> {
    if (!this.metadataStore) throw new Error("Metadata store is not loaded");

    return this.metadataStore.getMeasures();
  }

  public async getCatalogs(): Promise<DBSchemaCatalog[]> {
    const api = await this.api;

    const { catalogs } = await api.getCatalogs();
    return catalogs;
  }

  public async getCubes(catalogName: string): Promise<MDSchemaCube[]> {
    const api = await this.api;

    const { cubes } = await api.getCubes(catalogName);
    return cubes;
  }

  public async setCube(cube: MDSchemaCube) {
    this.cube = cube;
  }

  public async setCatalog(catalog: DBSchemaCatalog) {
    this.catalog = catalog;
  }

  public getProperties(): MDSchemaProperty[] {
    if (!this.metadataStore) throw new Error("Metadata store is not loaded");

    return this.metadataStore.getProperties();
  }

  public getLevels(): MDSchemaLevel[] {
    if (!this.metadataStore) throw new Error("Metadata store is not loaded");

    return this.metadataStore.getLevels();
  }

  public async getMember(
    parentLevel: MDSchemaLevel,
    parentName: string,
  ): Promise<MDSchemaMember> {
    const api = await this.api;

    return await api.getMember(parentLevel, parentName);
  }

  getState() {
    return JSON.stringify({
      id: this.id,
      url: this.url,
      caption: this.caption,
      type: this.type,
    });
  }

  loadState(state: string) {
    const parsed = JSON.parse(state);

    this.id = parsed.id;
    this.url = parsed.url;
    this.caption = parsed.caption;
    this.type = parsed.type;
    this.catalog = parsed.catalog;
    this.cube = parsed.cube;
  }
}
