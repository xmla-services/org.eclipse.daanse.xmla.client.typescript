import type {AxisData, Composer, Selector, useChartDataComposer} from "@/plugins/charts/widgets/api/ChartdataComposer";
import {computed, type ComputedRef, ref, type Ref} from "vue";


const useChartDataComposer = () => {

    const composers = ref<Composer<Selector>[]>([])

    const addComposer=(composer:Composer<Selector>)=>{
        composers.value.push(composer);
    };
    const setComposers=(composer:Composer<Selector>[])=>{
        composers.value = composer;
    }
    const removeComposer=(composer:Composer<Selector>)=>{
       let index =composers.value.indexOf(composer);
       if(index!=-1){
           composers.value.splice(index,1);
       }
    };
    const getDataForMergedAxisX=():Ref<AxisData>|ComputedRef<AxisData>=>{

        return computed(()=>{

            let data:(string|number)[] = []
            composers.value.forEach(composer=>{
                if(composer.getDataX) {
                    data = [...composer.getDataX().value.data];
                }
            });
            //unique
            data =data.filter((value, index, array)=>{
                return array.indexOf(value) === index;
            });

            return {
                data:data,
                title:(composers[0])?composers[0].title:''
            }
        });
    };
    const getDataForAxesY = ():(Ref<Array<AxisData>> | ComputedRef<Array<AxisData>>)=>{

        return computed(()=>{

            let data:AxisData[] = []
            composers.value.forEach(composer=>{
                if(composer.getDataY){
                    data = [...data,...composer.getDataY().value];
                }
            });
            return data

        });
    };

    return {
        addComposer,
        removeComposer,
        getDataForMergedAxisX,
        getDataForAxesY,
        setComposers
    }as useChartDataComposer


};
export default useChartDataComposer;
