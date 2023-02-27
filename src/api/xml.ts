import type { Client } from "eMondrianUtils/SOAPInBrowser/src/client";

class XMLAApi {
  public url: string;
  sessionId: string = "";
  SOAPClient: null | Client = null;

  constructor(SOAPClient: any, url: string) {
    this.url = url;
    this.SOAPClient = SOAPClient;
  }

  private rowToArray(row: any): any[] {
    if (Array.isArray(row)) return row;
    return [row];
  }

  public async startSession(): Promise<void> {
    const res = await this.SOAPClient?.ExecuteAsync({
      Headers: {
        BeginSession: {
          __attrs: {
            xmlns: "urn:schemas-microsoft-com:xml-analysis",
          },
        },
        Version: {},
      },
      Command: {
        Statement: "",
      },
      Properties: {
        PropertieList: {
          LocaleIdentifier: "1033",
        },
      },
    });

    const sessionId = res?.Header?.Session?.__attrs?.SessionId;
    this.sessionId = sessionId;
  }

  public async getCatalogs() {
    const catalogsResponce = await this.SOAPClient?.DiscoverAsync({
      Headers: {
        Session: {
          __attrs: {
            xmlns: "urn:schemas-microsoft-com:xml-analysis",
            SessionId: this.sessionId,
          },
        },
      },
      RequestType: "DBSCHEMA_CATALOGS",
      Restrictions: {
        RestrictionList: {},
      },
      Properties: {
        PropertyList: {},
      },
    });

    const catalogs = this.rowToArray(
      catalogsResponce.Body.DiscoverResponse.return[0].root.row
    );
    return {
      catalogs,
    };
  }

  public async getCubes(catalogName: string): Promise<{ cubes: any[] }> {
    const cubesResponce = await this.SOAPClient?.DiscoverAsync({
      Headers: {
        Session: {
          __attrs: {
            xmlns: "urn:schemas-microsoft-com:xml-analysis",
            SessionId: this.sessionId,
          },
        },
      },
      RequestType: "MDSCHEMA_CUBES",
      Restrictions: {
        RestrictionList: {
          CATALOG_NAME: catalogName,
        },
      },
      Properties: {
        PropertyList: {},
      },
    });

    const cubes = this.rowToArray(
      cubesResponce.Body.DiscoverResponse.return[0].root.row
    );
    return {
      cubes,
    };
  }

  public async getDimensions(
    catalogName: string,
    cubeName: string
  ): Promise<MDSchemaDimension[]> {
    const dimensionsResponce = await this.SOAPClient?.DiscoverAsync({
      Headers: {
        Session: {
          __attrs: {
            xmlns: "urn:schemas-microsoft-com:xml-analysis",
            SessionId: this.sessionId,
          },
        },
      },
      RequestType: "MDSCHEMA_DIMENSIONS",
      Restrictions: {
        RestrictionList: {
          CATALOG_NAME: catalogName,
          CUBE_NAME: cubeName,
        },
      },
      Properties: {
        PropertyList: {},
      },
    });

    return this.rowToArray(
      dimensionsResponce.Body.DiscoverResponse.return[0].root.row
    ) as MDSchemaDimension[];
  }

  public async getHierarchies(
    catalogName: string,
    cubeName: string
  ): Promise<MDSchemaHierarchy[]> {
    const hierarchiesResponce = await this.SOAPClient?.DiscoverAsync({
      Headers: {
        Session: {
          __attrs: {
            xmlns: "urn:schemas-microsoft-com:xml-analysis",
            SessionId: this.sessionId,
          },
        },
      },
      RequestType: "MDSCHEMA_HIERARCHIES",
      Restrictions: {
        RestrictionList: {
          CATALOG_NAME: catalogName,
          CUBE_NAME: cubeName,
        },
      },
      Properties: {
        PropertyList: {},
      },
    });

    return this.rowToArray(
      hierarchiesResponce.Body.DiscoverResponse.return[0].root.row
    ) as MDSchemaHierarchy[];
  }

  public async getLevels(
    catalogName: string,
    cubeName: string
  ): Promise<MDSchemaLevel[]> {
    const levelsResponce = await this.SOAPClient?.DiscoverAsync({
      Headers: {
        Session: {
          __attrs: {
            xmlns: "urn:schemas-microsoft-com:xml-analysis",
            SessionId: this.sessionId,
          },
        },
      },
      RequestType: "MDSCHEMA_LEVELS",
      Restrictions: {
        RestrictionList: {
          CATALOG_NAME: catalogName,
          CUBE_NAME: cubeName,
        },
      },
      Properties: {
        PropertyList: {},
      },
    });

    return this.rowToArray(
      levelsResponce.Body.DiscoverResponse.return[0].root.row
    ) as MDSchemaLevel[];
  }

  public async getMeasureGroups(
    catalogName: string,
    cubeName: string
  ): Promise<MDSchemaMeasureGroup[]> {
    const measureGroupsResponce = await this.SOAPClient?.DiscoverAsync({
      Headers: {
        Session: {
          __attrs: {
            xmlns: "urn:schemas-microsoft-com:xml-analysis",
            SessionId: this.sessionId,
          },
        },
      },
      RequestType: "MDSCHEMA_MEASUREGROUPS",
      Restrictions: {
        RestrictionList: {
          CATALOG_NAME: catalogName,
          CUBE_NAME: cubeName,
        },
      },
      Properties: {
        PropertyList: {},
      },
    });

    return this.rowToArray(
      measureGroupsResponce.Body.DiscoverResponse.return[0].root.row
    ) as MDSchemaMeasureGroup[];
  }

  public async getMeasures(
    catalogName: string,
    cubeName: string
  ): Promise<MDSchemaMeasure[]> {
    const measuresResponce = await this.SOAPClient?.DiscoverAsync({
      Headers: {
        Session: {
          __attrs: {
            xmlns: "urn:schemas-microsoft-com:xml-analysis",
            SessionId: this.sessionId,
          },
        },
      },
      RequestType: "MDSCHEMA_MEASURES",
      Restrictions: {
        RestrictionList: {
          CATALOG_NAME: catalogName,
          CUBE_NAME: cubeName,
        },
      },
      Properties: {
        PropertyList: {},
      },
    });

    return this.rowToArray(
      measuresResponce.Body.DiscoverResponse.return[0].root.row
    ) as MDSchemaMeasure[];
  }

  public async getSets(
    catalogName: string,
    cubeName: string
  ): Promise<MDSchemaSet[]> {
    const setsResponce = await this.SOAPClient?.DiscoverAsync({
      Headers: {
        Session: {
          __attrs: {
            xmlns: "urn:schemas-microsoft-com:xml-analysis",
            SessionId: this.sessionId,
          },
        },
      },
      RequestType: "MDSCHEMA_SETS",
      Restrictions: {
        RestrictionList: {
          CATALOG_NAME: catalogName,
          CUBE_NAME: cubeName,
        },
      },
      Properties: {
        PropertyList: {},
      },
    });

    return this.rowToArray(
      setsResponce.Body.DiscoverResponse.return[0].root.row
    ) as MDSchemaSet[];
  }

  public async getProperties(
    catalogName: string,
    cubeName: string
  ): Promise<MDSchemaProperty[]> {
    const propertiesResponce = await this.SOAPClient?.DiscoverAsync({
      Headers: {
        Session: {
          __attrs: {
            xmlns: "urn:schemas-microsoft-com:xml-analysis",
            SessionId: this.sessionId,
          },
        },
      },
      RequestType: "MDSCHEMA_PROPERTIES",
      Restrictions: {
        RestrictionList: {
          CATALOG_NAME: catalogName,
          CUBE_NAME: cubeName,
        },
      },
      Properties: {
        PropertyList: {},
      },
    });

    return this.rowToArray(
      propertiesResponce.Body.DiscoverResponse.return[0].root.row
    ) as MDSchemaProperty[];
  }

  public async getMembers(level: MDSchemaLevel): Promise<MDSchemaMember[]> {
    const propertiesResponce = await this.SOAPClient?.DiscoverAsync({
      Headers: {
        Session: {
          __attrs: {
            xmlns: "urn:schemas-microsoft-com:xml-analysis",
            SessionId: this.sessionId,
          },
        },
      },
      RequestType: "MDSCHEMA_MEMBERS",
      Restrictions: {
        RestrictionList: {
          CATALOG_NAME: level.CATALOG_NAME,
          CUBE_NAME: level.CUBE_NAME,
          DIMENSION_UNIQUE_NAME: level.DIMENSION_UNIQUE_NAME,
          HIERARCHY_UNIQUE_NAME: level.HIERARCHY_UNIQUE_NAME,
          LEVEL_UNIQUE_NAME: level.LEVEL_UNIQUE_NAME,
        },
      },
      Properties: {
        PropertyList: {},
      },
    });

    return this.rowToArray(
      propertiesResponce.Body.DiscoverResponse.return[0].root.row
    ) as MDSchemaMember[];
  }

  public async endSession(): Promise<void> {
    await this.SOAPClient?.ExecuteAsync({
      Headers: {
        EndSession: {
          __attrs: {
            xmlns: "urn:schemas-microsoft-com:xml-analysis",
            SessionId: this.sessionId,
          },
        },
      },
      Command: {
        Statement: {},
      },
      Properties: {},
    });

    this.sessionId = "";
  }
}

export { XMLAApi };
