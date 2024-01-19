/*
Copyright (c) 2023 Contributors to the  Eclipse Foundation.
    This program and the accompanying materials are made
available under the terms of the Eclipse Public License 2.0
which is available at https://www.eclipse.org/legal/epl-2.0/
    SPDX-License-Identifier: EPL-2.0

Contributors: Smart City Jena

*/
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
