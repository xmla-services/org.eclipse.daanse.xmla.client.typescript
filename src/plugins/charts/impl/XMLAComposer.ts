import type {
    AxisData,
    Composer,
    XMLASelector,
} from "@/plugins/charts/widgets/api/ChartdataComposer";
import { computed, type ComputedRef, type Ref, ref, watch } from "vue";

import { useStore } from "@/composables/widgets/store";

export class XMLAComposer implements Composer<XMLASelector> {
    private selectorX: XMLASelector | undefined;
    private selectorY: Array<XMLASelector> = [];
    private data: Ref<any> = ref({});
    private store: IStore | undefined;

    addSelectorY(selector: XMLASelector) {
        this.selectorY.push(selector);
    }
    getSelectorsY() {
        return this.selectorY;
    }
    setSelectorY(index: number, selector: XMLASelector) {
        if (this.selectorY[index]) {
            this.selectorY[index] = selector;
        }
    }

    setSelectorX(selector: XMLASelector) {
        this.selectorX = selector;
    }
    getSelectorX() {
        return this.selectorX;
    }

    setData(data: Ref<any>) {
        this.data = data;
    }
    setStore(store: IStore) {
        this.store = store;
    }
    getStore() {
        return this.store;
    }

    getDataX(): ComputedRef<AxisData> | Ref<AxisData> {
        return computed(() => {
            try {
                return {
                    //@ts-ignore
                    data: this.data.map((e) => e[this.selectorX!.header]),
                    title: this.selectorX?.header,
                    from: this.selectorX,
                } as AxisData;
            } catch (e) {
                return {
                    data: [],
                    title: this.selectorX?.header,
                    from: undefined,
                } as AxisData;
            }
        });
    }

    getDataY(): ComputedRef<Array<AxisData>> | Ref<Array<AxisData>> {
        return computed(() => {
            const ret: AxisData[] = [];
            this.selectorY.forEach((sel) => {
                try {
                    ret.push({
                        //@ts-ignore
                        data: this.data.map((e) => {
                            return {
                                x: e[this.selectorX!.header],
                                y: e[sel.header],
                            };
                        }),
                        title: sel.header,
                        from: sel,
                    } as AxisData);
                } catch (e) {}
            });
            return ret;
        });
    }
}
