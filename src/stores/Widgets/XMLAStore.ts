/*
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

*/

import { useDatasourceManager } from "@/composables/datasourceManager";
import { getMdxRequest } from "@/utils/MdxRequests/MdxRequestConstructor";
import BaseStore from "@/stores/Widgets/BaseStore";
import { useErrorHandler } from "@/composables/dashboard/errorToast";
interface EventBus {
  emit: (string, any?) => void;
  on: (string, Function) => void;
  off: (string, Function) => void;
}

export class XMLAStore extends BaseStore implements IStore{
  public static readonly TYPE = "XMLA";
  public readonly type = XMLAStore.TYPE;

  public datasourceId: string | null = null;
  private datasourceManager: any;
  public data = null;
  private eventBus = null as unknown as EventBus;
  public events = [] as Array<{ name: string; action: string }>;
  public initedEvents = [] as Array<{ name: string; cb: Function }>;


  public rowsDrilldownMembers = [] as any[];
  public columnsDrilldownMembers = [] as any[];
  public rowsExpandedMembers = [] as any[];
  public columnsExpandedMembers = [] as any[];

  public row = null as any;
  public column = null as any;
  public measure = null as any;
  private errorToast: any;

  constructor(id, caption, eventBus: EventBus) {
    super(id, caption, eventBus);

    this.datasourceManager = useDatasourceManager();
    this.eventBus = eventBus;
    this.errorToast = useErrorHandler();

    this.eventBus.on(`EXPAND:${this.id}`, ({ value, area }) => {
      if (area === "rows") {
        this.expandOnRows(value);
      } else if (area === "columns") {
        this.expandOnColumns(value);
      }
      this.eventBus.emit(`UPDATE:${this.id}`);
    });

    this.eventBus.on(`DRILLDOWN:${this.id}`, ({ value, area }) => {
      if (area === "rows") {
        this.drilldownOnRows(value);
      } else if (area === "columns") {
        this.drilldownOnColumns(value);
      }
      this.eventBus.emit(`UPDATE:${this.id}`);
    });

    this.eventBus.on(`DRILLUP:${this.id}`, ({ value, area }) => {
      if (area === "rows") {
        this.drillupOnRows(value);
      } else if (area === "columns") {
        this.drillupOnColumns(value);
      }

      this.eventBus.emit(`UPDATE:${this.id}`);
    });

    this.eventBus.on(`COLLAPSE:${this.id}`, ({ value, area }) => {
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
    const datasource = this.datasourceManager.getDatasource(this.datasourceId);

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
    const datasource = this.datasourceManager.getDatasource(this.datasourceId);

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
    console.log("expandOnRows", member);
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
    console.log("expandOnColumns", member);
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

  setDatasource(datasourceIds) {
    this.datasourceId = datasourceIds;
    this.eventBus.emit(`UPDATE:${this.id}`);
  }

  async getData({ rows, columns, measures }) {
    try {
      const datasource = this.datasourceManager.getDatasource(
        this.datasourceId,
      );

      this.flushDrilldowns();
      this.flushExpands();

      const rowsMapped = rows.map((e) => {
        return { originalItem: e };
      });

      const columnsMapped = columns.map((e) => {
        return { originalItem: e };
      });

      const measuresMapped = measures.map((e) => {
        return { originalItem: e };
      });

      const body = await this.getMDXRequest(
        rowsMapped,
        columnsMapped,
        measuresMapped,
        {
          showEmpty: true,
          alignContent: "right",
        },
      );

      const responce = await datasource.getData(body);
      return responce;
    } catch (e) {
      return this.errorToast.handleErrorToast(e);
    }
  }

  setOptions({ caption, column, row, measure }:IStoreParams) {
    this.caption = caption || this.caption;
    this.row = row || this.row;
    this.column = column || this.column;
    this.measure = measure || this.measure;

    this.eventBus.emit(`UPDATE:${this.id}`);
  }

  getDatasource() {
    return this.datasourceManager.getDatasource(this.datasourceId);
  }

  getState() {
    return {
      caption: this.caption,
      id: this.id,
      events: this.events,
      datasourceIds: this.datasourceId,
    };
  }

  loadState(state) {
    this.caption = state.caption;
    this.id = state.id;
    this.events = state.events;
    this.datasourceId = state.datasourceId;
  }

  async getMDXRequest(rows, columns, measures, pivotTableSettings) {
    const datasource = this.datasourceManager.getDatasource(this.datasourceId);

    const mdxRequest = await getMdxRequest(
      datasource.cube.CUBE_NAME,
      this.rowsDrilldownMembers,
      this.columnsDrilldownMembers,
      this.rowsExpandedMembers,
      this.columnsExpandedMembers,
      rows,
      columns,
      measures,
      // [{ originalItem: this.row }],
      // [{ originalItem: this.column }],
      // [{ originalItem: this.measure }],
      pivotTableSettings,
      datasource.getProperties(),
      [],
      datasource.getLevels(),
    );

    return mdxRequest;
  }
}
