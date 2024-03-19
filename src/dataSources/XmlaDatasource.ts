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
// import { createClientAsync, type XmlaClient } from ;

export default class RESTDatasource {
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
    url = "https://datacube-stage.nomad-dmz.jena.de/cube/xmla",
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

  getState() {
    return {
      id: this.id,
      url: this.url,
      caption: this.caption,
      type: this.type,
    };
  }
}
