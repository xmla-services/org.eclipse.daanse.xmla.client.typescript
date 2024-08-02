import type {
    AxisData,
    Composer,
    XMLASelector,
} from "@/plugins/charts/widgets/api/ChartdataComposer";
import { computed, type ComputedRef, type Ref, ref, watch } from "vue";
import { parseRequestToTable } from "@/utils/MdxRequests/MdxRequestHelper";
import {parseInt} from "lodash";


export class XMLAComposer implements Composer<XMLASelector> {
    private selectorX: XMLASelector | undefined;
    private selectorY: any = {};
    private data: Ref<any> = ref({});
    private store: IStore | undefined;
    public selectedMeasures: MDSchemaMeasure[] = [];
    public selectedRows: ConfiguredHierarchy[] = [];
    public selectedCols: ConfiguredHierarchy[] = [];
    public selectedFilters: ConfiguredHierarchy[] = [];
    public mainAxisRotate: boolean = false;

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

    setSelectorsY(selector: XMLASelector[], axisName) {
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
            console.log(this.data);
            try {
                return {
                    //@ts-ignore
                    data: this.data[this.selectorX!.header] || [],
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
                const availableSelectors = this.selectorY[axisName].map(
                    (sel) => {
                        return {
                            header: sel.header,
                            available: !!this.data[sel.header],
                        };
                    },
                );

                this.selectorY[axisName] = this.selectorY[axisName].filter(
                    (sel) => {
                        return availableSelectors.find(
                            (e) => e.header === sel.header,
                        )?.available;
                    },
                );

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

    async getData() {
        if (!this.store) return;
        const requestParams = {
            rows: this.selectedRows,
            columns: this.selectedCols,
            measures: this.selectedMeasures,
            rowsExpandedMembers: [],
            rowsDrilldownMembers: [],
            columnsExpandedMembers: [],
            columnsDrilldownMembers: [],
        };

        const mdxResponce = await this.store.getData(requestParams);

        if (this.mainAxisRotate) {
            return parseRequestToTable(mdxResponce, 1) as any;
        } else {
            return parseRequestToTable(mdxResponce, 0) as any;
        }
    }

    // TODO: find out why this is not working
    async fetch() {
        this.data.value = await this.getData();
    }

    async restoreState(state) {
        console.log(state.selectorY["y"]);
        this.selectedCols = state.selectedCols;
        this.selectedRows = state.selectedRows;
        this.selectedFilters = state.selectedFilters;
        this.selectedMeasures = state.selectedMeasures;
        this.mainAxisRotate = state.mainAxisRotate;

        // await this.fetch();
        this.data.value = await this.getData();
        this.selectorY = state.selectorY;
        this.selectorX = state.selectorX;
    }

    setSelectorY(selector: XMLASelector, axisName: string): void {
    }
}
