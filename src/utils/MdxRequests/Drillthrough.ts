/*
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

*/

export function getDrillthroughRequest(
  rowsMembers: any[],
  columnsMembers: any[]
) {
  const rowsString = rowsMembers.map((e) => e.UName).join(",");
  const colsString = columnsMembers.map((e) => e.UName).join(",");
  // return "DRILLTHROUGH MAXROWS 1000 SELECT FROM [Sales] WHERE ((([Measures].[Sales Count],[Product].[Food]),[Gender].[M]))";
  return `DRILLTHROUGH MAXROWS 1000 SELECT FROM [Sales] WHERE ((
    (${rowsString}),
    (${colsString})
  ))`;
}
