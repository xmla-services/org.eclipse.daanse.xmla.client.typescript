import type {AxisData, Composer, Selector} from "@/plugins/charts/widgets/api/ChartdataComposer";
import type {ComputedRef, Ref} from "vue";

declare interface ComposerRegistryMap {
    [key: string]: typeof Composer<any>;
}

declare interface useChartDataComposerI{
    registerComposer(class_ref: typeof Composer<Selector>,storetype:string):void;
    unRegisterDataSource(storetype:string):void;
    getComposerRegistry():ComposerRegistryMap;
    getComposerForStoreType(storetype:string):typeof Composer<Selector>|undefined;
    isRegistered(storetype:string):boolean
}

const registerComposer = (class_ref: typeof Composer<Selector>,storetype:string) => {
    composerRegistryMap[storetype] = class_ref;
};
const unRegisterDataSource = (storetype) => {
    delete composerRegistryMap[storetype];
    //dataSourceRegistry.push(class_ref);
};
const getComposerRegistry = () => {
    return composerRegistryMap;
};
const getComposerForStoreType = (storetype:string):typeof Composer<Selector>|undefined => {
    return composerRegistryMap[storetype]??undefined;
};
