import {defineStore} from "pinia";
import {ref} from "vue";

type ChartStoreItem = {
    mdx:string
}
export const useChartStore = defineStore("ChartWidget", () => {
    const state = ref({
        /** @type{ChartStoreItem[]}*/
        charts: [],
        inited: false,
    });
})


