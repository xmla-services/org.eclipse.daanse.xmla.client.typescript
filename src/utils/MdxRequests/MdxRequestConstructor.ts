/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
import {
  getRowsDrilldownRequestString,
  getColsDrilldownRequestString,
} from "./Drilldown";

export function getMdxRequest(
  cubename: string,
  rowsDrilldownMembers: any,
  columnsDrilldownMembers: any,
  rowsExpandedMembers: any,
  columnsExpandedMembers: any,
  rows: any[],
  columns: any[],
  measures: any[],
  pivotTableSettings: any,
  properties: any[],
  filters: any[]
) {
  const filtersRequest = getFiltersRequest(filters);

  if (!rows.length || !columns.length) {
    return getSingleHierarchyRequest(
      rows,
      columns,
      measures,
      cubename,
      rowsDrilldownMembers,
      columnsDrilldownMembers,
      rowsExpandedMembers,
      columnsExpandedMembers,
      pivotTableSettings,
      properties,
      filtersRequest
    );
  } else {
    let withSection = "WITH";
    let selectSection = "SELECT";
    const fromSection = getFromPart(measures, cubename, filtersRequest.where);

    if (!pivotTableSettings.showEmpty) selectSection += " NON EMPTY";

    const rowsProperties = getRowsProperies(rows, properties);
    const rowsRequest = getRowsRequest(
      rows,
      rowsDrilldownMembers,
      rowsExpandedMembers,
      measures
    );
    if (rowsRequest.with.length) {
      withSection = `${withSection} ${rowsRequest.with}`;
    }
    selectSection = `${selectSection}\n${rowsRequest.select} DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME${rowsProperties} ON 1,\n`;

    if (!pivotTableSettings.showEmpty) selectSection += " NON EMPTY";

    const colsProperties = getColumnsProperies(columns, properties);
    const colsRequest = getColumnsRequest(
      columns,
      columnsDrilldownMembers,
      columnsExpandedMembers,
      measures
    );
    if (colsRequest.with.length) {
      withSection = `${withSection} ${colsRequest.with}`;
    }
    selectSection = `${selectSection}\n${colsRequest.select} DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME${colsProperties} ON 0\n`;

    let resultString = "";

    if (filtersRequest.with) {
      withSection += filtersRequest.with;
    }

    if (withSection.length > 4) {
      resultString += withSection;
    }

    resultString += "\n";
    resultString += selectSection;
    resultString += fromSection;
    return resultString;
  }
}

function getColumnsRequest(
  columns: any,
  columnsDrilldownMembers: any[],
  colsExpandedMembers: any[],
  measures: any[]
) {
  let columnsSelect = "";
  let columnsWhere = "";

  if (columns.length >= 1) {
    columns.forEach((e: any, i: number) => {
      const columnsRequest = getSingleColumnRequest(
        e,
        columnsDrilldownMembers,
        colsExpandedMembers,
        measures
      );
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
  } else if (columns.length === 1) {
    columnsSelect = getSingleColumnRequest(
      columns[0],
      columnsDrilldownMembers,
      colsExpandedMembers,
      measures
    ).select;
  } else {
    columnsSelect = "";
  }

  return {
    select: columnsSelect,
    with: columnsWhere,
  };
}

function getSingleColumnRequest(
  e: any,
  columnsDrilldownMembers: any[],
  colsExpandedMembers: any[],
  measures
) {
  if (e.type === "Values") {
    const selectRequest = measures
      .map((e) => e.originalItem.MEASURE_UNIQUE_NAME)
      .join(",");
    return {
      select: `{${selectRequest}}`,
      with: "",
    };
  }

  const drilledDownMember = columnsDrilldownMembers.find(
    (drilldownedMembers) => {
      return (
        drilldownedMembers.HIERARCHY_UNIQUE_NAME ===
        e.originalItem.HIERARCHY_UNIQUE_NAME
      );
    }
  );
  const expandedMembers = colsExpandedMembers.filter((drilldownedMembers) => {
    return (
      drilldownedMembers.HIERARCHY_UNIQUE_NAME ===
      e.originalItem.HIERARCHY_UNIQUE_NAME
    );
  });

  if (drilledDownMember || expandedMembers.length) {
    const request = getColsDrilldownRequestString(
      drilledDownMember,
      colsExpandedMembers
    );

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

function getRowsRequest(
  rows: any,
  rowsDrilldownMembers: any[],
  rowsExpandedMembers: any[],
  measures: any[]
) {
  let rowsSelect = "";
  let rowsWhere = "";

  if (rows.length >= 1) {
    rows.forEach((e: any, i: number) => {
      const rowsRequest = getSingleRowRequest(
        e,
        rowsDrilldownMembers,
        rowsExpandedMembers,
        measures
      );
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
  } else if (rows.length === 1) {
    rowsSelect = `{ ${rows[0].originalItem.HIERARCHY_UNIQUE_NAME}.Members }`;
  } else {
    rowsSelect = "";
  }

  return {
    select: rowsSelect,
    with: rowsWhere,
  };
}

function getSingleRowRequest(
  e: any,
  rowsDrilldownMembers: any[],
  rowsExpandedMembers: any[],
  measures: any[]
) {
  if (e.type === "Values") {
    const selectRequest = measures
      .map((e) => e.originalItem.MEASURE_UNIQUE_NAME)
      .join(",");
    return {
      select: `{${selectRequest}}`,
      with: "",
    };
  }

  const drilledDownMember = rowsDrilldownMembers.find((drilldownedMembers) => {
    return (
      drilldownedMembers.HIERARCHY_UNIQUE_NAME ===
      e.originalItem.HIERARCHY_UNIQUE_NAME
    );
  });
  const expandedMembers = rowsExpandedMembers.filter((drilldownedMembers) => {
    return (
      drilldownedMembers.HIERARCHY_UNIQUE_NAME ===
      e.originalItem.HIERARCHY_UNIQUE_NAME
    );
  });
  if (drilledDownMember || expandedMembers.length) {
    const request = getRowsDrilldownRequestString(
      drilledDownMember,
      expandedMembers
    );

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

function getSingleHierarchyRequest(
  rows: any[],
  columns: any[],
  measures: any[],
  cubename: string,
  rowsDrilldownMembers: any,
  columnsDrilldownMembers: any,
  rowsExpandedMembers: any,
  columnsExpandedMembers: any,
  pivotTableSettings: any,
  properties: any[],
  filtersRequest: any
) {
  const selectPart = getSelectWithOptions(pivotTableSettings);
  const fromPart = getFromPart(measures, cubename, filtersRequest.where);

  if (rows.length) {
    const request = getRowsRequest(
      rows,
      rowsDrilldownMembers,
      rowsExpandedMembers,
      measures
    );

    const rowsSelect = request.select;
    let rowsWith = request.with ? `WITH ${request.with}` : "";

    if (filtersRequest.with) {
      if (rowsWith) rowsWith += filtersRequest.with;
      else rowsWith = `WITH ${filtersRequest.with}`;
    }

    const rowsProperties = getRowsProperies(rows, properties);

    return `
      ${rowsWith}
      ${selectPart}
      ${rowsSelect}
      DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME${rowsProperties} ON 0
      ${fromPart}
    `;
  } else if (columns.length) {
    const request = getColumnsRequest(
      columns,
      columnsDrilldownMembers,
      columnsExpandedMembers,
      measures
    );

    const colsSelect = request.select;
    let colsWith = request.with ? `WITH ${request.with}` : "";

    if (filtersRequest.with) {
      if (colsWith) colsWith += filtersRequest.with;
      else colsWith = `WITH ${filtersRequest.with}`;
    }

    const colsProperties = getColumnsProperies(columns, properties);

    return `
      ${colsWith}
      ${selectPart}
      ${colsSelect}
      DIMENSION PROPERTIES PARENT_UNIQUE_NAME,HIERARCHY_UNIQUE_NAME${colsProperties} ON 0
      ${fromPart}
    `;
  } else if (measures.length) {
    return `
      SELECT ${fromPart}
    `;
  }
  return "";
}

function getSelectWithOptions(pivotTableSettings) {
  let result = "SELECT";
  if (!pivotTableSettings.showEmpty) result += " NON EMPTY";
  return result;
}

function getFromPart(measures, cubename, filtersWhere) {
  let measuresPart = "";
  if (measures.length === 1) {
    measuresPart = `${measures[0].originalItem.MEASURE_UNIQUE_NAME}`;
  }

  let result = "";
  if (filtersWhere) {
    if (measuresPart) {
      result = `FROM [${cubename}] WHERE (${filtersWhere},${measuresPart}) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS`;
    } else {
      result = `FROM [${cubename}] WHERE (${filtersWhere}) CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS`;
    }
  } else {
    result = `FROM [${cubename}] WHERE ${measuresPart} CELL PROPERTIES VALUE, FORMAT_STRING, LANGUAGE, BACK_COLOR, FORE_COLOR, FONT_FLAGS`;
  }
  return result;
}

function getFiltersRequest(filters) {
  let withSection = "";
  let whereSection = "";
  if (!filters) {
    return {
      where: null,
      with: null,
    };
  }

  const filtersArray = filters.map((e) => e.filters);

  filtersArray.forEach((filter) => {
    if (!filter.enabled) return;

    if (filter.multipleChoise) {
      const uid = Math.random().toString(16).slice(2);
      console.log(filter);
      const filterSetName = `${filter.originalItem.DIMENSION_UNIQUE_NAME}.[FILTER_${uid}]`;

      const selectedItems = filter.selectedItems.map((e) => e.UName).join(",");
      withSection += ` MEMBER ${filterSetName} AS 'Aggregate({${selectedItems}})'`;

      if (whereSection.length) whereSection += ",";
      whereSection += filterSetName;
      // TODO
    } else {
      if (whereSection.length) whereSection += ",";
      whereSection += filter.selectedItem.UName;
    }
  });

  return {
    where: whereSection,
    with: withSection,
  };
}
