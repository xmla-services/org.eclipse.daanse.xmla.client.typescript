/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/

/**
 * Describes an event item with a name and trigger.
 * @interface EventItem - The interface name
 * @property {string} name - The event name
 * @property {string} trigger - The event that trigger the event
 */
export interface EventItem {
  name: string;
  trigger: string;
}
