import {defineStore} from "pinia";
import {ref} from "vue";
import {getMdxRequest} from "@/utils/MdxRequests/MdxRequestConstructor";

import GiteaWrapper from "@/generated/gitea/gitea_wrapper/gitea.wrapper";
type ChartStoreItem = {
    mdx:string
}
export const useDashboardStore = defineStore("DashboardStore", () => {
    const state = ref({
        /** @type{ChartStoreItem[]}*/
        dashboards: [],
        inited: false,
    });

    const fetchDashboardAllCategories = async ()=> {
        //     let repos = (await new GiteaWrapper().getRepos())
        // repos[0].getDashboards()
    }
    return {
        state,
        fetchDashboardAllCategories
    }
})
