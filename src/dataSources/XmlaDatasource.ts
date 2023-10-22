import { XMLAApi } from "@/api/xml";
import { createClientAsync } from "@/XMLAClient";
// import { createClientAsync, type XmlaClient } from ;

export default class RESTDatasource {
  public url = "";
  public id = null;
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
}
