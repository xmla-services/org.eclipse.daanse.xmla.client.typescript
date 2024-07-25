import type {
    AxisData,
    Composer,
    XMLASelector,
} from "@/plugins/charts/widgets/api/ChartdataComposer";
import { computed, type ComputedRef, type Ref, ref, watch } from "vue";

import { useStore } from "@/composables/widgets/store";

export class XMLAComposer implements Composer<XMLASelector> {
    private selectorX: XMLASelector | undefined;
    private selectorY: any = {};
    private data: Ref<any> = ref({});
    private store: IStore | undefined;
    type: string = "XMLA";

    addSelectorY(selector: XMLASelector, axisName: string) {
        if (!selector) return;
        if (!this.selectorY[axisName]) this.selectorY[axisName] = [];

        this.selectorY[axisName].push(selector);
    }

    getSelectorsY() {
        return this.selectorY;
    }

    getSelectorY(axisName: string) {
        if (!this.selectorY[axisName]) {
            return [];
        }

        return this.selectorY[axisName];
    }

    setSelectorY(selector: XMLASelector, axisName) {
        if (!this.selectorY[axisName]) {
            this.selectorY[axisName] = [];
        }

        this.selectorY[axisName] = selector;
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
                    data: this.data[this.selectorX!.header],
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
            const axises = Object.keys(this.selectorY);

            axises.forEach((axisName) => {
                this.selectorY[axisName].forEach((sel) => {
                    try {
                        ret.push({
                            //@ts-ignore
                            data: this.data[sel.header].map((e, i) => {
                                console.log(this.selectorX);
                                if (!this.selectorX?.header) return;
                                return {
                                    y: parseInt(e),
                                    x: this.data[this.selectorX.header][i],
                                };
                            }),
                            title: sel.header,
                            from: axisName,
                        } as unknown as AxisData);
                    } catch (e) {
                        console.error(e);
                    }
                });
            });
            return ret;
        });
    }
}
