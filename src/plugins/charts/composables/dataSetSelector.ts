import type {IDataSetSelector} from "@/plugins/charts/widgets/api/DataSetSelector";
import {useStore} from "@/composables/widgets/store";
import {computed} from "vue";
import {isArray} from "lodash";


export function useDataSetSelector() {

    const {setStore,store,data} = useStore();


    const getDataFilterer = (store:IStore,selector:string) => {
        setStore(store);

        const  checkData= (parts,input)=> {
            //console.log(parts);
            //console.log(input);
            let data = null;
            const isroot = parts[0].includes('root');
            const isArray = parts[0].match(/\[[0-9]*\]/g);
            //console.log(isArray);
            let subpart = null;

            if (isroot) {
                if (isArray) {
                    if(Array.isArray(input)) {
                        return input.map(e => checkData(parts.slice(1), e));
                    }else return []
                } else {
                    return input;
                }

            } else {
                if (isArray) {
                    subpart = parts[0].split('[')[0]
                    if(Array.isArray(input[subpart!])){
                        return input[subpart!].map(e => {
                            return checkData(parts.slice(1), e)});
                    }else{
                        return [];
                    }
                } else {
                    if(parts.length===1){
                        //console.log(input[parts[0]])
                        return input[parts[0]];
                    }else{
                        if(parts[0] in  input){
                            return checkData(parts.slice(1), input[parts[0]]);
                        }else{
                            return [];
                        }

                    }

                }
            }

        }


        return computed(()=>{
            const parts = selector.split('.');
            return checkData(parts,data.value)
        })

    }
return{
    getDataFilterer
}


}
