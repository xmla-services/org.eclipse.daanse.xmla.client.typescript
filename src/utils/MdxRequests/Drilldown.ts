/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
import { useTreeViewDataStore } from "@/stores/TreeView";

export function getRowsDrilldownRequestString(rowsDrilldownMember: any) {
  const uid = Math.random().toString(16).slice(2);
  const setSection = `SET [Row_Dim_${uid}] AS 'VisualTotals(Distinct(Hierarchize({Ascendants(${rowsDrilldownMember.UName}), Descendants(${rowsDrilldownMember.UName})})))'`;

  const treeViewStore = useTreeViewDataStore();

  const rowsMemberLevel = treeViewStore.levels.find(
    (e) => e.LEVEL_UNIQUE_NAME === rowsDrilldownMember.LName
  );

  const rowsLevels = treeViewStore.levels.filter((e) => {
    return (
      e.HIERARCHY_UNIQUE_NAME === rowsMemberLevel?.HIERARCHY_UNIQUE_NAME &&
      e.LEVEL_NUMBER <= rowsMemberLevel.LEVEL_NUMBER
    );
  });

  let hierarchizeString = "";
  for (let i = 0; i < rowsLevels.length; i++) {
    if (!hierarchizeString.length) {
      hierarchizeString = `
      DrilldownLevel({
        ${rowsLevels[i].LEVEL_UNIQUE_NAME}
      })
      `;
    } else {
      hierarchizeString = `
        DrilldownLevel({
          ${hierarchizeString}
          },
          ${rowsLevels[i].LEVEL_UNIQUE_NAME}
        ) 
      `;
    }
  }

  hierarchizeString = `
  Hierarchize(Intersect(AddCalculatedMembers({
    ${hierarchizeString}
  }), [Row_Dim_${uid}]))
  `;

  return {
    with: setSection,
    select: hierarchizeString,
  };
}

export function getColsDrilldownRequestString(columnsDrilldownMember: any) {
  const uid = Math.random().toString(16).slice(2);
  const setSection = `SET [Col_Dim_${uid}] AS 'VisualTotals(Distinct(Hierarchize({Ascendants(${columnsDrilldownMember.UName}), Descendants(${columnsDrilldownMember.UName})})))'`;

  const treeViewStore = useTreeViewDataStore();

  const colsMemberLevel = treeViewStore.levels.find(
    (e) => e.LEVEL_UNIQUE_NAME === columnsDrilldownMember.LName
  );

  const colsLevels = treeViewStore.levels.filter((e) => {
    return (
      e.HIERARCHY_UNIQUE_NAME === colsMemberLevel?.HIERARCHY_UNIQUE_NAME &&
      e.LEVEL_NUMBER <= colsMemberLevel.LEVEL_NUMBER
    );
  });

  let hierarchizeString = "";
  for (let i = 0; i < colsLevels.length; i++) {
    if (!hierarchizeString.length) {
      hierarchizeString = `
      DrilldownLevel({
        ${colsLevels[i].LEVEL_UNIQUE_NAME}
      })
      `;
    } else {
      hierarchizeString = `
        DrilldownLevel({
          ${hierarchizeString}
          },
          ${colsLevels[i].LEVEL_UNIQUE_NAME}
        ) 
      `;
    }
  }

  hierarchizeString = `
  Hierarchize(Intersect(AddCalculatedMembers({
    ${hierarchizeString}
  }), [Col_Dim_${uid}]))
  `;

  return {
    with: setSection,
    select: hierarchizeString,
  };
}
