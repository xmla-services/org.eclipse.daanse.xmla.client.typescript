import {
  getRowsDrilldownRequestString,
  getColsDrilldownRequestString,
} from "./Drilldown";

export function getMdxRequest(
  cubename: string,
  rowsDrilldownMembers: any,
  columnsDrilldownMembers: any,
  rows: any[],
  columns: any[],
  pivotTableSettings: any,
  properties: any[]
) {
  if (!rows.length || !columns.length) return "";

  let withSection = "WITH";
  let selectSection = "SELECT";
  const fromSection = `FROM ${cubename}`;

  if (!pivotTableSettings.showEmpty) selectSection += " NON EMPTY";

  const rowsProperties = getRowsProperies(rows, properties);
  const rowsRequest = getRowsRequest(rows, rowsDrilldownMembers);
  if (rowsRequest.with.length) {
    withSection = `${withSection} ${rowsRequest.with}`;
  }
  selectSection = `${selectSection}\n${rowsRequest.select} DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME${rowsProperties} ON 1,\n`;

  if (!pivotTableSettings.showEmpty) selectSection += " NON EMPTY";

  const colsProperties = getColumnsProperies(columns, properties);
  const colsRequest = getColumnsRequest(columns, columnsDrilldownMembers);
  if (colsRequest.with.length) {
    withSection = `${withSection} ${colsRequest.with}`;
  }
  selectSection = `${selectSection}\n${colsRequest.select} DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME${colsProperties} ON 0\n`;

  let resultString = "";

  if (withSection.length > 4) {
    resultString += withSection;
  }
  resultString += "\n";
  resultString += selectSection;
  resultString += fromSection;

  return resultString;
}

function getColumnsRequest(columns: any, columnsDrilldownMembers: any[]) {
  let columnsSelect = "";
  let columnsWhere = "";

  if (columns.length >= 1) {
    columns.forEach((e: any, i: number) => {
      const columnsRequest = getSingleColumnRequest(e, columnsDrilldownMembers);
      if (i === 0) {
        columnsSelect = columnsRequest.select;
        columnsWhere = columnsRequest.with;
      } else {
        columnsWhere += columnsRequest.with;

        columnsSelect = `
          CrossJoin(
            ${columnsSelect},
            ${columnsRequest.select}
          )`;
      }
    });
  } else {
    columnsSelect = `{ ${columns[0].originalItem.HIERARCHY_UNIQUE_NAME}.Members }`;
  }

  return {
    select: columnsSelect,
    with: columnsWhere,
  };
}

function getSingleColumnRequest(e: any, columnsDrilldownMembers: any[]) {
  const drilledDownMember = columnsDrilldownMembers.find(
    (drilldownedMembers) => {
      return (
        drilldownedMembers.HIERARCHY_UNIQUE_NAME ===
        e.originalItem.HIERARCHY_UNIQUE_NAME
      );
    }
  );
  if (drilledDownMember) {
    const request = getColsDrilldownRequestString(drilledDownMember);

    return {
      with: request.with,
      select: request.select,
    };
  }
  return {
    select: `Hierarchize({DrilldownLevel({${e.originalItem.HIERARCHY_UNIQUE_NAME}},,,INCLUDE_CALC_MEMBERS)})`,
    with: "",
  };
}

function getRowsRequest(rows: any, rowsDrilldownMembers: any[]) {
  let rowsSelect = "";
  let rowsWhere = "";

  if (rows.length >= 1) {
    rows.forEach((e: any, i: number) => {
      const rowsRequest = getSingleRowRequest(e, rowsDrilldownMembers);
      if (i === 0) {
        rowsSelect = rowsRequest.select;
        rowsWhere = rowsRequest.with;
      } else {
        rowsWhere += rowsRequest.with;

        rowsSelect = `
          CrossJoin(
            ${rowsSelect},
            ${rowsRequest.select}
          )`;
      }
    });
  } else {
    rowsSelect = `{ ${rows[0].originalItem.HIERARCHY_UNIQUE_NAME}.Members }`;
  }

  return {
    select: rowsSelect,
    with: rowsWhere,
  };
}

function getSingleRowRequest(e: any, rowsDrilldownMembers: any[]) {
  const drilledDownMember = rowsDrilldownMembers.find((drilldownedMembers) => {
    return (
      drilldownedMembers.HIERARCHY_UNIQUE_NAME ===
      e.originalItem.HIERARCHY_UNIQUE_NAME
    );
  });
  if (drilledDownMember) {
    const request = getRowsDrilldownRequestString(drilledDownMember);

    return {
      with: request.with,
      select: request.select,
    };
  }
  return {
    select: `Hierarchize({DrilldownLevel({${e.originalItem.HIERARCHY_UNIQUE_NAME}},,,INCLUDE_CALC_MEMBERS)})`,
    with: "",
  };
}

function getRowsProperies(rows: any, properties: any[]) {
  const rowsProperties = [] as any[];

  rows.forEach((e: any) => {
    rowsProperties.push(
      properties.filter(
        (prop) =>
          prop.HIERARCHY_UNIQUE_NAME === e.originalItem.HIERARCHY_UNIQUE_NAME
      )
    );
  });

  let rowsPropertiesList = rowsProperties
    .flat(1)
    .map((e: any) => `${e.LEVEL_UNIQUE_NAME}.[${e.PROPERTY_NAME}]`)
    .join(",");

  if (rowsPropertiesList) rowsPropertiesList = `,${rowsPropertiesList}`;
  return rowsPropertiesList;
}

function getColumnsProperies(columns: any, properties: any[]) {
  const columnsProperties = [] as any[];

  columns.forEach((e: any) => {
    columnsProperties.push(
      properties.filter(
        (prop) =>
          prop.HIERARCHY_UNIQUE_NAME === e.originalItem.HIERARCHY_UNIQUE_NAME
      )
    );
  });

  let columnsPropertiesList = columnsProperties
    .flat(1)
    .map((e: any) => `${e.LEVEL_UNIQUE_NAME}.[${e.PROPERTY_NAME}]`)
    .join(",");

  if (columnsPropertiesList)
    columnsPropertiesList = `,${columnsPropertiesList}`;
  return columnsPropertiesList;
}
