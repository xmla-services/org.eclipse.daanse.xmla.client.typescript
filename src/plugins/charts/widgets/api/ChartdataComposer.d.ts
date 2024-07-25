import type {Datastream} from "@/plugins/charts/dataSources/STAClient";
import type {ComputedRef, Ref} from "vue";

export interface useChartDataComposer{
    addComposer(composer:Composer):void;
    removeComposer(composer:Composer):void;
    getDataForMergedAxisX():Ref<AxisData>|ComputedRef<AxisData>;
    getDataForAxesY():Ref<Array<AxisData>>|ComputedRef<Array<AxisData>>;
    setComposers(composer:Composer<Selector>[]):void;
}

export interface Composer<Selector>{

    setData(data:Ref<any>):void;
    setStore(store:IStore):void;
    getStore():IStore|undefined;
    setSelectorX(selector:Selector);
    addSelectorY(selector:Selector,axisName:string);
    getSelectorX():Selector|undefined;
    getSelectorsY():{
        [key:string]:Array<Selector>
    };
    setSelectorsY(selectors:Selector[], axisName?: string):void;
    setSelectorY(selector:Selector,axisName:string):void;
    getDataX():ComputedRef<AxisData>|Ref<AxisData>;
    getDataY():ComputedRef<Array<AxisData>>|Ref<Array<AxisData>>;
}
export interface AxisData{
    title:string,
    data:Array<string|number>,
    from?:string
}
export abstract interface Selector{
    id:string
}

export interface CSVSelector extends Selector{
        header:string;
}
export interface XMLASelector extends Selector{
    type:HeaderType;
    header?:string;
}
export interface STASelector extends Selector{
    things?:Thing[];
    datastreams?:Datastream[];
}
export enum HeaderType{
    ROW,
    COLUMN
}

