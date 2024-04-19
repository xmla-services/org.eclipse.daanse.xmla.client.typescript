import { useDatasourceManager } from "@/composables/datasourceManager";
import { getMdxRequest } from "@/utils/MdxRequests/MdxRequestConstructor";

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

  public rowsDrilldownMembers = [] as any[];
  public columnsDrilldownMembers = [] as any[];
  public rowsExpandedMembers = [] as any[];
  public columnsExpandedMembers = [] as any[];

  public row = null as any;
  public column = null as any;
  public measure = null as any;

  constructor(id, caption, eventBus: EventBus) {
    this.id = id;
    this.caption = caption;
    this.datasourceManager = useDatasourceManager();
    this.eventBus = eventBus;

    this.eventBus.on(`EXPAND:${this.id}`, ({ value, area }) => {
      console.log("EXPAND", value, area);
      if (area === "rows") {
        this.expandOnRows(value);
      } else if (area === "columns") {
        this.expandOnColumns(value);
      }
      this.eventBus.emit(`UPDATE:${this.id}`);
    });

    this.eventBus.on(`DRILLDOWN:${this.id}`, ({ value, area }) => {
      console.log("DRILLDOWN", value, area);
      if (area === "rows") {
        this.drilldownOnRows(value);
      } else if (area === "columns") {
        this.drilldownOnColumns(value);
      }
      this.eventBus.emit(`UPDATE:${this.id}`);
    });

    this.eventBus.on(`DRILLUP:${this.id}`, ({ value, area }) => {
      console.log("DRILLUP", value, area);
      if (area === "rows") {
        this.drillupOnRows(value);
      } else if (area === "columns") {
        this.drillupOnColumns(value);
      }

      console.log(this.rowsDrilldownMembers);
      console.log(this.columnsDrilldownMembers);
      this.eventBus.emit(`UPDATE:${this.id}`);
    });

    this.eventBus.on(`COLLAPSE:${this.id}`, ({ value, area }) => {
      console.log("COLLAPSE", value, area);
      if (area === "rows") {
        this.collapseOnRows(value);
      } else if (area === "columns") {
        this.collapseOnColumns(value);
      }
      this.eventBus.emit(`UPDATE:${this.id}`);
    });
  }

  drilldownOnRows(member) {
    const expandedIndex = this.rowsExpandedMembers.findIndex(
      (e: any) => e.UName === member.UName,
    );

    if (expandedIndex >= 0) this.rowsExpandedMembers.splice(expandedIndex, 1);

    const sameHierarchyIndex = this.rowsDrilldownMembers.findIndex((e: any) => {
      return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
    });

    if (member.LNum === "0") {
      this.rowsDrilldownMembers.splice(sameHierarchyIndex, 1);
    } else {
      if (sameHierarchyIndex >= 0) {
        this.rowsDrilldownMembers.splice(sameHierarchyIndex, 1, member);
      } else {
        this.rowsDrilldownMembers.push(member);
      }
    }
  }

  async drillupOnRows(member) {
    const datasource = this.datasourceManager.getDatasource(
      this.datasourceIds[0],
    );

    const levels = datasource.getLevels();

    const parentLevel = levels.find((e) => {
      return (
        e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME &&
        e.LEVEL_NUMBER === Math.max(parseInt(member.LNum) - 1, 0).toString()
      );
    });

    if (parentLevel) {
      const parentMember = await datasource.getMember(
        parentLevel,
        member.PARENT_UNIQUE_NAME,
      );

      const requestParentLevel = levels.find((e) => {
        return (
          e.HIERARCHY_UNIQUE_NAME === parentMember.HIERARCHY_UNIQUE_NAME &&
          e.LEVEL_NUMBER ===
            Math.max(parseInt(parentMember.LEVEL_NUMBER) - 1, 0).toString()
        );
      });
      if (requestParentLevel) {
        const createdMember = {
          UName: parentMember.PARENT_UNIQUE_NAME,
          LName: requestParentLevel.LEVEL_UNIQUE_NAME,
          HIERARCHY_UNIQUE_NAME: requestParentLevel.HIERARCHY_UNIQUE_NAME,
          LNum: requestParentLevel.LEVEL_NUMBER,
        };

        this.drilldownOnRows(createdMember);
      }
    }
  }

  async drillupOnColumns(member) {
    const datasource = this.datasourceManager.getDatasource(
      this.datasourceIds[0],
    );

    const levels = datasource.getLevels();

    const parentLevel = levels.find((e) => {
      return (
        e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME &&
        e.LEVEL_NUMBER === Math.max(parseInt(member.LNum) - 1, 0).toString()
      );
    });

    if (parentLevel) {
      const parentMember = await datasource.getMember(
        parentLevel,
        member.PARENT_UNIQUE_NAME,
      );

      const requestParentLevel = levels.find((e) => {
        return (
          e.HIERARCHY_UNIQUE_NAME === parentMember.HIERARCHY_UNIQUE_NAME &&
          e.LEVEL_NUMBER ===
            Math.max(parseInt(parentMember.LEVEL_NUMBER) - 1, 0).toString()
        );
      });
      if (requestParentLevel) {
        const createdMember = {
          UName: parentMember.PARENT_UNIQUE_NAME,
          LName: requestParentLevel.LEVEL_UNIQUE_NAME,
          HIERARCHY_UNIQUE_NAME: requestParentLevel.HIERARCHY_UNIQUE_NAME,
          LNum: requestParentLevel.LEVEL_NUMBER,
        };

        this.drilldownOnColumns(createdMember);
      }
    }
  }

  drilldownOnColumns(member) {
    const expandedIndex = this.columnsExpandedMembers.findIndex(
      (e: any) => e.UName === member.UName,
    );

    if (expandedIndex >= 0)
      this.columnsExpandedMembers.splice(expandedIndex, 1);

    const sameHierarchyIndex = this.columnsDrilldownMembers.findIndex(
      (e: any) => {
        return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
      },
    );

    if (member.LNum === "0") {
      this.columnsDrilldownMembers.splice(sameHierarchyIndex, 1);
    } else {
      if (sameHierarchyIndex >= 0) {
        this.columnsDrilldownMembers.splice(sameHierarchyIndex, 1, member);
      } else {
        this.columnsDrilldownMembers.push(member);
      }
    }
  }

  flushDrilldowns() {
    const columns = [this.column];

    const notUsedHierarchiesInDrilldownCols =
      this.columnsDrilldownMembers.filter((e: any) => {
        return !columns.some((member) => {
          return member.HIERARCHY_UNIQUE_NAME === e.HIERARCHY_UNIQUE_NAME;
        });
      });

    notUsedHierarchiesInDrilldownCols.forEach((member: any) => {
      const itemIndex = this.columnsDrilldownMembers.findIndex((e: any) => {
        return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
      });

      this.columnsDrilldownMembers.splice(itemIndex, 1);
    });

    const rows = [this.row];
    const notUsedHierarchiesInDrilldownRows = this.rowsDrilldownMembers.filter(
      (e: any) => {
        return !rows.some((member) => {
          return member.HIERARCHY_UNIQUE_NAME === e.HIERARCHY_UNIQUE_NAME;
        });
      },
    );

    notUsedHierarchiesInDrilldownRows.forEach((member: any) => {
      const itemIndex = this.rowsDrilldownMembers.findIndex((e: any) => {
        return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
      });

      this.rowsDrilldownMembers.splice(itemIndex, 1);
    });
  }

  expandOnRows(member) {
    const currentMemberHierarchyItems: any[] = this.rowsExpandedMembers.filter(
      (e: any) => {
        return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
      },
    );
    currentMemberHierarchyItems.push(member);
    currentMemberHierarchyItems.sort(
      (a, b) => parseInt(a.LNum) - parseInt(b.LNum),
    );
    const indexInSorted = currentMemberHierarchyItems.indexOf(member);
    if (indexInSorted === 0) {
      if (currentMemberHierarchyItems.length > 1) {
        const nextItemIndex = this.rowsExpandedMembers.findIndex(
          (e) => e.UName === currentMemberHierarchyItems[1].UName,
        );
        this.rowsExpandedMembers.splice(nextItemIndex, 0, member);
      } else {
        this.rowsExpandedMembers.push(member);
      }
    } else {
      const prevItemIndex = this.rowsExpandedMembers.findIndex(
        (e) => e.UName === currentMemberHierarchyItems[indexInSorted - 1].UName,
      );
      this.rowsExpandedMembers.splice(prevItemIndex + 1, 0, member);
    }
  }

  collapseOnRows(member) {
    const itemIndex = this.rowsExpandedMembers.findIndex((e: any) => {
      return e.UName === member.UName;
    });

    this.rowsExpandedMembers.splice(itemIndex, 1);
  }

  expandOnColumns(member) {
    const currentMemberHierarchyItems: any[] =
      this.columnsExpandedMembers.filter((e: any) => {
        return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
      });
    currentMemberHierarchyItems.push(member);
    currentMemberHierarchyItems.sort(
      (a, b) => parseInt(a.LNum) - parseInt(b.LNum),
    );
    const indexInSorted = currentMemberHierarchyItems.indexOf(member);
    if (indexInSorted === 0) {
      if (currentMemberHierarchyItems.length > 1) {
        const nextItemIndex = this.columnsExpandedMembers.findIndex(
          (e) => e.UName === currentMemberHierarchyItems[1].UName,
        );
        this.columnsExpandedMembers.splice(nextItemIndex, 0, member);
      } else {
        this.columnsExpandedMembers.push(member);
      }
    } else {
      const prevItemIndex = this.columnsExpandedMembers.findIndex(
        (e) => e.UName === currentMemberHierarchyItems[indexInSorted - 1].UName,
      );
      this.columnsExpandedMembers.splice(prevItemIndex + 1, 0, member);
    }
  }

  collapseOnColumns(member) {
    const itemIndex = this.columnsExpandedMembers.findIndex((e: any) => {
      return e.UName === member.UName;
    });

    this.columnsExpandedMembers.splice(itemIndex, 1);
  }

  flushExpands() {
    const columns = [this.column];

    const notUsedHierarchiesInDrilldownCols =
      this.columnsExpandedMembers.filter((e: any) => {
        return !columns.some((member) => {
          return member.HIERARCHY_UNIQUE_NAME === e.HIERARCHY_UNIQUE_NAME;
        });
      });

    notUsedHierarchiesInDrilldownCols.forEach((member: any) => {
      const itemIndex = this.columnsExpandedMembers.findIndex((e: any) => {
        return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
      });

      this.columnsExpandedMembers.splice(itemIndex, 1);
    });

    const rows = [this.row];
    const notUsedHierarchiesInDrilldownRows = this.rowsExpandedMembers.filter(
      (e: any) => {
        return !rows.some((member) => {
          return member.HIERARCHY_UNIQUE_NAME === e.HIERARCHY_UNIQUE_NAME;
        });
      },
    );

    notUsedHierarchiesInDrilldownRows.forEach((member: any) => {
      const itemIndex = this.rowsExpandedMembers.findIndex((e: any) => {
        return e.HIERARCHY_UNIQUE_NAME === member.HIERARCHY_UNIQUE_NAME;
      });

      this.rowsExpandedMembers.splice(itemIndex, 1);
    });
  }

  addDatasource(datasourceId) {
    this.datasourceIds.push(datasourceId);
  }

  setDatasources(datasourceIds) {
    this.datasourceIds = [...datasourceIds];
    this.eventBus.emit(`UPDATE:${this.id}`);
  }

  async getData() {
    const datasource = this.datasourceManager.getDatasource(
      this.datasourceIds[0],
    );

    this.flushDrilldowns();
    this.flushExpands();
    const body = await this.getMDXRequest({
      showEmpty: true,
      alignContent: "right",
    });
    console.log();

    const responce = await datasource.getData(body);
    console.log(responce);
    return responce;
  }

  setOptions({ caption, column, row, measure }) {
    this.caption = caption || this.caption;
    this.row = row || this.row;
    this.column = column || this.column;
    this.measure = measure || this.measure;

    // if (this.row && this.column && this.measure) {
    //   this.getData();
    // }

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

  async getMDXRequest(pivotTableSettings) {
    const datasource = this.datasourceManager.getDatasource(
      this.datasourceIds[0],
    );

    console.log(this.measure);
    console.log(this.row);
    console.log(this.column);

    console.log(datasource.cube);
    const mdxRequest = await getMdxRequest(
      datasource.cube.CUBE_NAME,
      this.rowsDrilldownMembers,
      this.columnsDrilldownMembers,
      this.rowsExpandedMembers,
      this.columnsExpandedMembers,
      [{ originalItem: this.row }],
      [{ originalItem: this.column }],
      [{ originalItem: this.measure }],
      pivotTableSettings,
      datasource.getProperties(),
      [],
      datasource.getLevels(),
    );

    return mdxRequest;
  }
}
