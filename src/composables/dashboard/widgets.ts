/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
import { ref, getCurrentInstance } from "vue";
import { enabledWidgets, widgetNames } from "@/components/Widgets";

declare interface Widget {
  id: string;
  component: string;
  caption: string;
  state?: any;
}

// declare interface Control {
//   id: string;
//   component: string;
//   caption: string;
//   state?: any;
// }

export function useWidgets() {
  const instance = getCurrentInstance();
  const widgets = ref<Widget[]>([]);

  const widgetsStorage: ISerializable = {
    getState: () => {
      const state = {};

      widgets.value.forEach((widget) => {
        const refs = instance?.refs;
        if (!refs) return;

        const componentRef = refs[`${widget.id}_component`] as ISerializable[];
        state[widget.id] = componentRef[0].getState();

        const wrapperRef = refs[`${widget.id}_wrapper`] as ISerializable[];
        state[`${widget.id}_wrapper`] = wrapperRef[0].getState();
      });

      return JSON.stringify(state);
    },
    loadState: (state) => {
      console.warn("Not implemented", state);
    },
  };

  const addWidget = (component: string, id: string) => {
    widgets.value.push({
      id,
      component,
      caption: "Test",
    });
  };

  const removeWidget = (id: string) => {
    widgets.value = widgets.value.filter((widget) => widget.id !== id);
  };

  return {
    widgets,
    widgetsStorage,
    addWidget,
    enabledWidgets,
    widgetNames,
    removeWidget,
  };
}
