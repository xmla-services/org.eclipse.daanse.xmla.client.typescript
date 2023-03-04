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
    if (row) {
      return [row];
    }
    return [];
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

  public async getLevelMembers(
    level: MDSchemaLevel,
    amount: number,
    start: number
  ): Promise<any[]> {
    const levelMembersRequestMDX = `
      select Subset(${level.LEVEL_UNIQUE_NAME}.AllMembers, ${start}, ${
      amount + 1
    }) 
      DIMENSION PROPERTIES MEMBER_TYPE on 0, 
      {} on 1 
      from ${level.CUBE_NAME}
    `;

    const levelMembersResponce = await this.getMDX(levelMembersRequestMDX);
    return this.rowToArray(
      levelMembersResponce.Body.ExecuteResponse.return.root.Axes.Axis[0].Tuples
        .Tuple
    );
  }

  public async getChildMembers(
    member: MDSchemaMember,
    amount: number,
    start: number
  ): Promise<any[]> {
    const childMembersRequestMDX = `
      select Subset({AddCalculatedMembers(${
        member.MEMBER_UNIQUE_NAME
      }.Children)}, ${start}, ${amount + 1}) 
      DIMENSION PROPERTIES MEMBER_TYPE on 0, 
      {} on 1 
      from ${member.CUBE_NAME}
    `;

    const childMembersResponce = await this.getMDX(childMembersRequestMDX);
    return this.rowToArray(
      childMembersResponce.Body.ExecuteResponse.return.root.Axes.Axis[0].Tuples
        .Tuple
    );
  }

  public async getMDX(mdx: string): Promise<any> {
    const propertiesResponce = await this.SOAPClient?.ExecuteAsync({
      Headers: {
        Session: {
          __attrs: {
            xmlns: "urn:schemas-microsoft-com:xml-analysis",
            SessionId: this.sessionId,
          },
        },
      },
      Command: {
        Statement: mdx,
      },
      Properties: {},
    });

    return propertiesResponce;
  }

  public async getPivotTableData(
    cubename: string,
    rows: any,
    columns: any
  ): Promise<any> {
    console.log(rows);
    console.log(columns);
    let mdxRequest;
    if (rows.length && columns.length) {
      mdxRequest = `
          SELECT
          { ${rows[0].originalItem.HIERARCHY_UNIQUE_NAME}.Members } ON 0,
          { ${columns[0].originalItem.HIERARCHY_UNIQUE_NAME}.Members } ON 1
          FROM ${cubename}
      `;
    } else {
      mdxRequest = `
          SELECT
          FROM ${cubename}
      `;
    }

    const mdxResponce = await this.getMDX(mdxRequest);
    const axis0 = this.rowToArray(
      mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis?.[0]?.Tuples
        ?.Tuple
    );
    const axis1 = this.rowToArray(
      mdxResponce.Body.ExecuteResponse.return.root.Axes?.Axis?.[1]?.Tuples
        ?.Tuple
    );
    const cells = this.rowToArray(
      mdxResponce.Body.ExecuteResponse.return.root.CellData?.Cell
    );

    return {
      axis0,
      axis1,
      cells,
    };
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
