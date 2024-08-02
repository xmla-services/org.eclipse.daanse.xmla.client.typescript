/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/
import { ref, getCurrentInstance } from "vue";

declare interface LayoutItem {
    x: number;
    y: number;
    width: number;
    height: number;
    z: number;
}

declare interface Layout {
    [key: string]: LayoutItem;
}

declare interface LayoutStorage extends ISerializable {
    getState: () => string;
    loadState: (state: any) => void;
}

export function useMoveableLayout() {
    const instance = getCurrentInstance();
    const layout = ref<Layout>({});

    const layoutStorage: LayoutStorage = {
        getState: () => {
            return JSON.stringify(layout.value);
        },
        loadState: (state) => {
            const parsed = JSON.parse(state);
            layout.value = parsed;
        },
    };

    const getInitialStyle = (id: string) => {
        return {
            width: `${layout.value[id].width}px`,
            height: `${layout.value[id].height}px`,
            transform: `translate(${layout.value[id].x}px, ${layout.value[id].y}px)`,
            "z-index": layout.value[id].z,
        };
    };

    const getMovableControlStyles = (id: string) => {
        return {
            "z-index": layout.value[id].z,
        };
    };

    const drag = (id: string, e) => {
        layout.value[id].x = e.translate[0];
        layout.value[id].y = e.translate[1];

        e.target.style.transform = e.transform;
    };

    const resize = (id: string, e) => {
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;

        layout.value[id].width = e.width;
        layout.value[id].height = e.height;
        layout.value[id].x = e.drag.translate[0];
        layout.value[id].y = e.drag.translate[1];

        e.target.style.transform = e.drag.transform;
    };

    const updateZIndex = () => {
        let zIndexMax = 0;
        let zIndexMin = 0;
        let countMaxZValues = 0;
        let countMinZValues = 0;

        const zIndexValues = Object.values(layout.value).map((item) => item.z);
        zIndexMax = Math.max(...zIndexValues);
        zIndexMin = Math.min(...zIndexValues);
        countMaxZValues = zIndexValues.filter((z) => z === zIndexMax).length;
        countMinZValues = zIndexValues.filter((z) => z === zIndexMin).length;

        return {
            zIndexMax,
            zIndexMin,
            countMaxZValues,
            countMinZValues,
        };
    };

    const updateElementZIndex = (refs: any, id: string, zIndex: number) => {
        const ref = refs[id] as HTMLElement[];
        const componentRef = refs[`${id}_control`] as { $el: HTMLElement }[];

        if (ref && componentRef) {
            ref[0].style["z-index"] = zIndex;
            componentRef[0].$el.style["z-index"] = zIndex;
        }
    };

    const moveUp = (id: string) => {
        const refs = instance?.refs;
        if (!refs) return;

        const { zIndexMax, countMaxZValues } = updateZIndex();

        if (layout.value[id].z === zIndexMax && countMaxZValues === 1) {
            return;
        }

        layout.value[id].z = layout.value[id].z + 1;
        updateElementZIndex(refs, id, layout.value[id].z);
    };

    const moveDown = (id: string) => {
        const refs = instance?.refs;
        if (!refs) return;

        const { zIndexMin, countMinZValues } = updateZIndex();

        if (layout.value[id].z === zIndexMin && countMinZValues === 1) {
            return;
        }

        layout.value[id].z = layout.value[id].z - 1;
        updateElementZIndex(refs, id, layout.value[id].z);
    };

    const moveToBottom = (id) => {
        const obj = Object.entries(layout.value);
        const res = obj.reduce(function (p, v) {
            return p[1].z < v[1].z ? p : v;
        }, obj[0]);

        if (id !== res[0]) {
            const { zIndexMin } = updateZIndex();
            layout.value[id].z = zIndexMin - 1;

            const refs = instance?.refs;
            if (!refs) return;

            updateElementZIndex(refs, id, layout.value[id].z);
        }
    };

    const moveToTop = (id) => {
        const obj = Object.entries(layout.value);
        const res = obj.reduce(function (p, v) {
            return p[1].z > v[1].z ? p : v;
        }, obj[0]);

        if (id !== res[0]) {
            const { zIndexMax } = updateZIndex();
            layout.value[id].z = zIndexMax + 1;

            const refs = instance?.refs;
            if (!refs) return;

            updateElementZIndex(refs, id, layout.value[id].z);
        }
    };

    return {
        layout,
        layoutStorage,
        getInitialStyle,
        getMovableControlStyles,
        drag,
        resize,
        moveUp,
        moveDown,
        moveToBottom,
        moveToTop,
    };
}
