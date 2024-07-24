/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors: Smart City Jena

*/


import type {ComposerRegistryMap, useChartDataComposerI} from "@/plugins/charts/widgets/api/ComposerManager";

import type {Composer,Selector} from "@/plugins/charts/widgets/api/ChartdataComposer";



const composerRegistryMap: ComposerRegistryMap = {};


const  useComposerManager=()=> {

    const registerComposer = (class_ref:Composer<Selector>,storetype:string) => {
        composerRegistryMap[storetype] = class_ref;
    };
    const unRegisterDataSource = (storetype) => {
        delete composerRegistryMap[storetype];
        //dataSourceRegistry.push(class_ref);
    };
    const getComposerRegistry = () => {
        return composerRegistryMap;
    };
    const getComposerForStoreType = (storetype:string):Composer<Selector>|undefined => {
        return composerRegistryMap[storetype]??undefined;
    };
    const isRegistered=(storetype:string)=>{
        return Object.keys(composerRegistryMap).includes(storetype)
    }

    return {
        registerComposer,
        getComposerRegistry,
        unRegisterDataSource,
        getComposerForStoreType,
        isRegistered
    } as useChartDataComposerI;
}
export default useComposerManager;
