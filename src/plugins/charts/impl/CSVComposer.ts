import type {AxisData, Composer, CSVSelector, XMLASelector} from "@/plugins/charts/widgets/api/ChartdataComposer";
import {computed, type ComputedRef, type Ref, ref, watch} from "vue";

import {useStore} from "@/composables/widgets/store";



export class CSVComposer implements Composer<CSVSelector>{

    private selectorX:CSVSelector|undefined;
    private selectorY:Array<CSVSelector> = [];
    private data: Ref<any> = ref({});
    private store: IStore|undefined;



    addSelectorY(selector: CSVSelector) {
        this.selectorY.push(selector);
    }
    getSelectorsY(){
        return this.selectorY;
    }
    setSelectorY(index:number,selector:CSVSelector){
        if(this.selectorY[index]){
            this.selectorY[index] = selector;
        }
    }

    setSelectorX(selector: CSVSelector) {
        this.selectorX = selector;
    }
    getSelectorX(){
        return this.selectorX;
    }

    setData(data:Ref<any>) {
        this.data=data;
    }
    setStore(store:IStore){
        this.store = store;
    }
    getStore(){
        return this.store;
    }

    getDataX(): ComputedRef<AxisData> | Ref<AxisData> {
        return computed(()=>{
            try{
                return {//@ts-ignore
                    data: this.data.map(e=>e[this.selectorX!.header]),
                    title: this.selectorX?.header
                } as AxisData
            }
            catch (e) {
                return  {
                    data: [],
                    title: this.selectorX?.header
                } as AxisData
            }



        });
    }

    getDataY(): ComputedRef<Array<AxisData>> | Ref<Array<AxisData>> {
        return computed(()=>{
            let ret:AxisData[] = [];
            this.selectorY.forEach(sel=>{
                try {

                    ret.push({//@ts-ignore
                        data: this.data.map(e => {return {x:e[this.selectorX!.header],y:e[sel.header]}}),
                        title: sel.header
                    } as AxisData);
                }
                catch(e){

                }
            });
            return ret;

        });
    }


}
