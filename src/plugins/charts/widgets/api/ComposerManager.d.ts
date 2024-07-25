import type {AxisData, Composer, Selector} from "@/plugins/charts/widgets/api/ChartdataComposer";
import type {Component, ComputedRef, Ref} from "vue";

declare interface ComposerRegistryMap {
    [key: string]: typeof Composer<any>;
}
declare interface ComposerRegistrySettingsMap {
    [key: string]: Component;
}

declare interface useChartDataComposerI{
    registerComposer(class_ref: typeof Composer<Selector>,settingComponent:Component,storetype:string):void;
    unRegisterDataSource(storetype:string):void;
    getComposerRegistry():ComposerRegistryMap;
    getComposerForStoreType(storetype:string):typeof Composer<Selector>|undefined;
    getSettingsComponentForType(storetype:string):Component;
    isRegistered(storetype:string):boolean
}


