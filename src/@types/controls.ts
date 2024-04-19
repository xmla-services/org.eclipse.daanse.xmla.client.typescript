/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
import { type Component } from 'vue';

export interface EventItem {
  name: string;
  trigger: string;
}

export interface ButtonComponentProps {
  component: {
    title: string;
    availableEvents: string[];
    events: EventItem[];
    settings: Component;
  }
}

export interface ComponentProps {
  component: {
    label: string;
    availableEvents: string[];
    events: EventItem[];
    settings: Component;
  }
}

export interface SelectComponentProps {
  component: {
    label: string;
    title: string;
    availableEvents: string[];
    events: EventItem[];
    options: string[];
    settings: Component;
    selectValue: string;
  }
}
