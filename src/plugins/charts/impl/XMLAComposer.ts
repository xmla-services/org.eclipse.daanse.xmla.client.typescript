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
    setSelectorY(selector: XMLASelector, value: boolean) {
        console.log(selector, value);
        const existing = this.selectorY.find((e) => e.id === selector.id);
        if (existing && value === false) {
            this.selectorY = this.selectorY.filter((e) => e.id !== selector.id);
        } else {
            this.selectorY.push({
                ...selector,
            });
        }

        console.log(this.selectorY);
        // if (this.selectorY[index]) {
        //     this.selectorY[index] = selector;
        // }
    }

    setSelectorX(selector: XMLASelector) {
        console.log(selector);
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
            this.selectorY.forEach((sel) => {
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
                        from: sel,
                    } as AxisData);
                } catch (e) {}
            });
            console.log(ret);
            console.log(this.data);
            return ret;
        });
    }
}
