/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
import { useTreeViewDataStore } from "@/stores/TreeView";

export function getRowsDrilldownRequestString(
  rowsDrilldownMember: any,
  expandedMembers: any[]
) {
  const treeViewStore = useTreeViewDataStore();

  if (rowsDrilldownMember) {
    const uid = Math.random().toString(16).slice(2);
    const setSection = `SET [Row_Dim_${uid}] AS 'VisualTotals(Distinct(Hierarchize({Ascendants(${rowsDrilldownMember.UName}), Descendants(${rowsDrilldownMember.UName})})))'`;

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

    if (expandedMembers) {
      const rowsRootLevel = treeViewStore.levels.find((e) => {
        return (
          e.HIERARCHY_UNIQUE_NAME ===
            expandedMembers[0]?.HIERARCHY_UNIQUE_NAME && e.LEVEL_NUMBER === "0"
        );
      });

      for (let i = 0; i < expandedMembers.length; i++) {
        if (!hierarchizeString.length) {
          hierarchizeString = `DrilldownMember({{DrilldownLevel({${rowsRootLevel?.LEVEL_UNIQUE_NAME}})}}, {${expandedMembers[i].UName}})`;
        } else {
          hierarchizeString = `
            DrilldownMember({{
              ${hierarchizeString}
            }}, {${expandedMembers[i].UName}})
          `;
        }
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
  } else {
    let hierarchizeString = "";

    const rowsRootLevel = treeViewStore.levels.find((e) => {
      return (
        e.HIERARCHY_UNIQUE_NAME === expandedMembers[0]?.HIERARCHY_UNIQUE_NAME &&
        e.LEVEL_NUMBER === "0"
      );
    });

    for (let i = 0; i < expandedMembers.length; i++) {
      if (i === 0) {
        hierarchizeString = `DrilldownMember({{DrilldownLevel({${rowsRootLevel?.LEVEL_UNIQUE_NAME}})}}, {${expandedMembers[i].UName}})`;
      } else {
        hierarchizeString = `
          DrilldownMember({{
            ${hierarchizeString}
          }}, {${expandedMembers[i].UName}})
        `;
      }
    }
    hierarchizeString = `
      Hierarchize(
        AddCalculatedMembers
        (
          ${hierarchizeString}
        )
      )`;

    return {
      with: "",
      select: hierarchizeString,
    };
  }
}

export function getColsDrilldownRequestString(
  columnsDrilldownMember: any,
  expandedMembers: any[]
) {
  const treeViewStore = useTreeViewDataStore();

  if (columnsDrilldownMember) {
    const uid = Math.random().toString(16).slice(2);
    const setSection = `SET [Col_Dim_${uid}] AS 'VisualTotals(Distinct(Hierarchize({Ascendants(${columnsDrilldownMember.UName}), Descendants(${columnsDrilldownMember.UName})})))'`;

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

    if (expandedMembers) {
      const colsRootLevel = treeViewStore.levels.find((e) => {
        return (
          e.HIERARCHY_UNIQUE_NAME ===
            expandedMembers[0]?.HIERARCHY_UNIQUE_NAME && e.LEVEL_NUMBER === "0"
        );
      });

      for (let i = 0; i < expandedMembers.length; i++) {
        if (!hierarchizeString.length) {
          hierarchizeString = `DrilldownMember({{DrilldownLevel({${colsRootLevel?.LEVEL_UNIQUE_NAME}})}}, {${expandedMembers[i].UName}})`;
        } else {
          hierarchizeString = `
            DrilldownMember({{
              ${hierarchizeString}
            }}, {${expandedMembers[i].UName}})
          `;
        }
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
  } else {
    let hierarchizeString = "";

    const colsRootLevel = treeViewStore.levels.find((e) => {
      return (
        e.HIERARCHY_UNIQUE_NAME === expandedMembers[0]?.HIERARCHY_UNIQUE_NAME &&
        e.LEVEL_NUMBER === "0"
      );
    });

    for (let i = 0; i < expandedMembers.length; i++) {
      if (i === 0) {
        hierarchizeString = `DrilldownMember({{DrilldownLevel({${colsRootLevel?.LEVEL_UNIQUE_NAME}})}}, {${expandedMembers[i].UName}})`;
      } else {
        hierarchizeString = `
          DrilldownMember({{
            ${hierarchizeString}
          }}, {${expandedMembers[i].UName}})
        `;
      }
    }
    hierarchizeString = `
      Hierarchize(
        AddCalculatedMembers
        (
          ${hierarchizeString}
        )
      )`;

    return {
      with: "",
      select: hierarchizeString,
    };
  }
}
